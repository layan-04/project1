//import natural library (tokenizers and classifiers)
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Training data (keywords/intents)
const trainingData = {
  greeting: ["hi", "hello", "hey", "good morning", "good evening"],
  password: ["password", "reset password", "strong password"],
  security_tips: ["security tips", "stay safe", "protect my account"],
  two_factor: ["2fa", "two factor", "authentication", "two-step"],
  social_engineering: ["social engineering", "hackers trick"],
  phishing: ["phishing", "fake email", "scam"],
  safe_browsing: ["safe browsing", "browse safely"],
  data_privacy: ["privacy", "protect my data"],
  malware: ["malware", "virus", "ransomware"],
  vpn: ["vpn", "virtual private network", "private network"],
  encryption: ["encryption", "encrypt", "secure data"],
  general_chat: ["who are you", "help me", "what can you do"]
};

// Responses for each intent
const responses = {
  greeting: "Hello! How can I help you today?",
  password: "You can reset your password from the account settings page. Always use a strong one!",
  security_tips: "Keep your software updated, enable 2FA, and avoid suspicious links.",
  two_factor: {
    definition: "Two-factor authentication (2FA) adds an extra layer of security to your accounts.",
    tips: "Enable 2FA on all important accounts, preferably with an authenticator app instead of SMS.",
    example: "Logging in with a password and then a code from Google Authenticator is 2FA."
  },
  social_engineering: {
    definition: "Social engineering is when attackers trick people into giving away information.",
    prevention: "Never share sensitive information with people you don’t trust.",
    examples: "Phishing emails and fake calls are common examples."
  },
  phishing: {
    definition: "Phishing is when attackers impersonate trusted people to steal information.",
    prevention: "Always check email senders and avoid suspicious links.",
    examples: "Fake login pages and scam messages are typical phishing attempts."
  },
  safe_browsing: "Avoid suspicious websites and make sure the site uses HTTPS.",
  data_privacy: "Limit personal information you share online and adjust privacy settings.",
  malware: {
    definition: "Malware is harmful software like viruses or ransomware.",
    prevention: "Use antivirus software and avoid downloading unknown files.",
    removal: "Run a trusted antivirus scan to remove malware."
  },
  vpn: {
    definition: "A VPN encrypts your internet connection, hiding your activity from hackers and trackers.",
    tips: "Use a reputable VPN provider, enable it on all devices, and avoid free VPNs with weak privacy policies.",
    example: "For example, connecting to a VPN while on public Wi-Fi keeps your data safe from attackers."
  },
  encryption: {
    definition: "Encryption converts data into a secure format that only authorized parties can read.",
    tips: "Use end-to-end encryption for messaging apps, encrypt sensitive files, and use HTTPS websites.",
    example: "WhatsApp messages are protected with end-to-end encryption."
  },
  general_chat: "I’m your cybersecurity assistant 🤖. Ask me anything about staying safe online!"
};

// Create a naive Bayes classifier
const classifier = new natural.BayesClassifier();
for (const intent in trainingData) {
  trainingData[intent].forEach(phrase => {
    classifier.addDocument(phrase.toLowerCase(), intent);
  });
}
classifier.train();

// Detect intent by keywords using regex
function detectByKeywords(text) {
  const t = text.toLowerCase();
  for (const intent in trainingData) {
    for (const phrase of trainingData[intent]) {
      const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (regex.test(t)) return intent;
    }
  }
  return null;
}

// Function to get bot response
function getBotResponse(userInput) {
  const lower = userInput.toLowerCase();
  const tokens = tokenizer.tokenize(lower);

  let intent = detectByKeywords(lower);
  if (!intent) return "Sorry, I don’t understand.";

  // Special logic for structured responses
  const structuredIntents = ["social_engineering", "phishing", "malware", "vpn", "two_factor", "encryption"];
  if (structuredIntents.includes(intent)) {
    const resp = responses[intent];
    if (lower.includes("what is") || lower.includes("define")) return resp.definition;
    if (lower.includes("tip") || lower.includes("prevent") || lower.includes("how to")) return resp.tips || resp.prevention;
    if (lower.includes("example") || lower.includes("demo")) return resp.example || resp.examples;
    return resp.definition; // default
  }

  return responses[intent] || "Sorry, I don’t understand.";
}

module.exports = {
  getBotResponse,
  trainingData,
  responses,
  classifier
};
