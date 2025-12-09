//tools from node.js
const https = require('https'); //for making HTTPS requests
const http = require('http'); //for making HTTP requests
const dns = require('dns'); //for converting hostnames to IP addresses
const { URL } = require('url'); //for parsing and working with URLs

//function that follows redirects until final destination
async function fetchFinal(url, depth = 0, maxDepth = 5) {
  return new Promise((resolve, reject) => {
    //stop if too many redirects (avoid loops)
    if (depth > maxDepth) return reject(new Error('Too many redirects'));

    let parsed;
    try {
      //try to turn the string into a URL object
      parsed = new URL(url);
    } catch {
      //if it fails, the link is not valid
      return reject(new Error('Invalid URL format'));
    }

    //choose correct protocol (HTTPS or HTTP) based on the URL
    const protocol = parsed.protocol === 'https:' ? https : http;
    //options for the request
    const options = {
      hostname: parsed.hostname, //domain name
      port: parsed.protocol === 'https:' ? 443 : 80, //port (443 for HTTPS, 80 for HTTP)
      path: parsed.pathname || '/', //path part of the URL
      method: 'GET', //we are making a GET request
      rejectUnauthorized: true, //reject invalid SSL certificates
      agent: false //force fresh TLS connection
    };

    //make the request
    const req = protocol.request(options, (res) => {
      //if the server says "go somewhere else" (redirect)
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        const nextUrl = new URL(res.headers.location, url).href; //build the new URL
        return resolve(fetchFinal(nextUrl, depth + 1, maxDepth)); //follow the redirect
      }
      resolve({ res, parsed }); //if no redirect, return the response and parsed URL
    });

    req.on('error', reject); //if request fails, reject with error
    req.end(); //end the request (actually send it)
  });
}

//function to turn certificate date strings into numbers we can compare
function parseCertDate(dateStr) {
  // Example: "Nov  4 08:00:00 2025 GMT"
  return Date.parse(dateStr.replace(/\s{2,}/g, ' ')); //clean spaces and parse into timestamp
}

//main function that scans a URL and checks if it is safe
exports.scanUrl = async (req, res) => {
  const { url } = req.body; //get the "url" from the request body
  if (!url) return res.status(400).json({ safe: false, reason: 'No URL provided' }); //if no URL, return error

  try {
    const parsed = new URL(url); //try to parse the URL
    //look up the IP address of the hostname
    dns.lookup(parsed.hostname, async (err, ip) => {
      if (err) return res.json({ safe: false, reason: 'DNS lookup failed' }); //if DNS fails, return error

      try {
        //follow redirects to get the final response and URL
        const { res: response, parsed: finalParsed } = await fetchFinal(url);

        const isHttps = finalParsed.protocol === 'https:'; //check if final URL uses HTTPS
        let certInfo = null; //will hold certificate details
        let certValid = true; //assume certificate is valid
        let reason = null; //reason if not valid

        if (isHttps) {
          //get SSL certificate from the server
          const cert = response.socket.getPeerCertificate(true); 
          if (!cert || Object.keys(cert).length === 0) {
            certValid = false; //no certificate found
            reason = 'No SSL certificate';
          } else {
            //save certificate details
            certInfo = {
              subject: cert.subject, //who certificate is for
              issuer: cert.issuer, //who issued the certificate
              valid_from: cert.valid_from, //start date
              valid_to: cert.valid_to, //expiry date
            };

            //check if certificate is valid right now
            const now = Date.now(); //current time
            const notBefore = parseCertDate(cert.valid_from); //start date as number
            const notAfter = parseCertDate(cert.valid_to); //end date as number

            if (!isNaN(notBefore) && now < notBefore) {
              certValid = false; //certificate not yet valid
              reason = 'Certificate not yet valid';
            } else if (!isNaN(notAfter) && now > notAfter) {
              certValid = false; //certificate expired
              reason = 'Expired SSL certificate';
            }
          }
        }

        //safe if HTTPS and certificate is valid
        const safe = isHttps && certValid;

        //send back the result as JSON
        res.json({
          safe, //whether the site is safe
          statusCode: response.statusCode, //HTTP status code
          ip, //IP address of the site
          finalUrl: finalParsed.href, //final URL after redirects
          certificate: certInfo, //certificate details
          reason: safe ? null : reason || (!isHttps ? 'Not HTTPS' : 'Invalid SSL'),
        });
      } catch (error) {
        //handle errors with SSL/TLS
        let reason = 'Request failed';
        const msg = (error.message || '').toLowerCase(); //error message text
        const code = error.code || ''; //error code

        //map specific errors to human-readable reasons
        if (code === 'DEPTH_ZERO_SELF_SIGNED_CERT' || code === 'SELF_SIGNED_CERT_IN_CHAIN' || msg.includes('self signed')) {
          reason = 'Self-signed SSL certificate';
        } else if (code === 'CERT_COMMON_NAME_INVALID' || code === 'HOSTNAME_MISMATCH' || msg.includes('hostname')) {
          reason = 'Certificate hostname mismatch';
        } else if (code === 'CERT_HAS_EXPIRED' || msg.includes('expired')) {
          reason = 'Expired SSL certificate';
        } else if (code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || code === 'CERT_UNTRUSTED' || msg.includes('unable to verify')) {
          reason = 'Untrusted SSL certificate';
        } else if (code === 'CERT_REVOKED') {
          reason = 'Certificate revoked';
        }

        //send back error result
        res.json({ safe: false, reason, error: error.message, code });
      }
    });
  } catch {
    //if URL parsing fails, return error
    res.json({ safe: false, reason: 'Invalid URL format' });
  }
};
