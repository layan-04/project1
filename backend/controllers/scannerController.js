const https = require('https');
const http = require('http');
const dns = require('dns');
const { URL } = require('url');

// Helper: follow redirects until final destination
async function fetchFinal(url, depth = 0, maxDepth = 5) {
  return new Promise((resolve, reject) => {
    if (depth > maxDepth) return reject(new Error('Too many redirects'));

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return reject(new Error('Invalid URL format'));
    }

    const protocol = parsed.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsed.hostname,
      port: parsed.protocol === 'https:' ? 443 : 80,
      path: parsed.pathname || '/',
      method: 'GET',
      rejectUnauthorized: true,
      agent: false // 🔑 force fresh TLS connection, no socket reuse
    };

    const req = protocol.request(options, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        const nextUrl = new URL(res.headers.location, url).href;
        return resolve(fetchFinal(nextUrl, depth + 1, maxDepth));
      }
      resolve({ res, parsed });
    });

    req.on('error', reject);
    req.end();
  });
}

// Helper: normalize OpenSSL date strings
function parseCertDate(dateStr) {
  // Example: "Nov  4 08:00:00 2025 GMT"
  return Date.parse(dateStr.replace(/\s{2,}/g, ' '));
}

exports.scanUrl = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ safe: false, reason: 'No URL provided' });

  try {
    const parsed = new URL(url);
    dns.lookup(parsed.hostname, async (err, ip) => {
      if (err) return res.json({ safe: false, reason: 'DNS lookup failed' });

      try {
        const { res: response, parsed: finalParsed } = await fetchFinal(url);

        const isHttps = finalParsed.protocol === 'https:';
        let certInfo = null;
        let certValid = true;
        let reason = null;

        if (isHttps) {
          const cert = response.socket.getPeerCertificate(true); // true = full chain
          if (!cert || Object.keys(cert).length === 0) {
            certValid = false;
            reason = 'No SSL certificate';
          } else {
            certInfo = {
              subject: cert.subject,
              issuer: cert.issuer,
              valid_from: cert.valid_from,
              valid_to: cert.valid_to,
            };

            const now = Date.now();
            const notBefore = parseCertDate(cert.valid_from);
            const notAfter = parseCertDate(cert.valid_to);

            if (!isNaN(notBefore) && now < notBefore) {
              certValid = false;
              reason = 'Certificate not yet valid';
            } else if (!isNaN(notAfter) && now > notAfter) {
              certValid = false;
              reason = 'Expired SSL certificate';
            }
          }
        }

        // ✅ Safe if HTTPS + valid certificate
        const safe = isHttps && certValid;

        res.json({
          safe,
          statusCode: response.statusCode,
          ip,
          finalUrl: finalParsed.href,
          certificate: certInfo,
          reason: safe ? null : reason || (!isHttps ? 'Not HTTPS' : 'Invalid SSL'),
        });
      } catch (error) {
        // Map TLS error codes
        let reason = 'Request failed';
        const msg = (error.message || '').toLowerCase();
        const code = error.code || '';

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

        res.json({ safe: false, reason, error: error.message, code });
      }
    });
  } catch {
    res.json({ safe: false, reason: 'Invalid URL format' });
  }
};
