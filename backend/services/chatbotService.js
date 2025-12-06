const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// =======================
// Training Data
// =======================
const trainingData = {
  greeting: ["hi", "hello", "hey", "good morning", "good evening"],
  password: ["password", "reset password", "strong password"],
  security_tips: ["security tips", "stay safe", "protect my account"],
  two_factor: ["2fa", "two factor", "authentication"],
  social_engineering: ["social engineering", "hackers trick"],
  phishing: ["phishing", "fake email", "scam"],
  safe_browsing: ["safe browsing", "browse safely"],
  data_privacy: ["privacy", "protect my data"],
  malware: ["malware", "virus", "ransomware"],
  general_chat: ["who are you", "help me", "what can you do"]
};

// =======================
// Responses
// =======================
const responses = {
  greeting: "Hello! How can I help you today?",
  password: "You can reset your password from the account settings page. Always use a strong one!",
  security_tips: "Keep your software updated, enable 2FA, and avoid suspicious links.",
  two_factor: "Two-factor authentication adds extra security. Enable it in your account settings.",
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
  general_chat: "I’m your cybersecurity assistant 🤖. Ask me anything about staying safe online!"
};

// =======================
// CLASSIFIER SETUP
// =======================
const classifier = new natural.BayesClassifier();

for (const intent in trainingData) {
  trainingData[intent].forEach(phrase => {
    classifier.addDocument(phrase.toLowerCase(), intent);
  });
}

classifier.train();

// =======================
// KEYWORD DETECTION (STRICT WHOLE WORDS)
// =======================
function detectByKeywords(text) {
  const t = text.toLowerCase();

  for (const intent in trainingData) {
    for (const phrase of trainingData[intent]) {
      // Match whole words only, avoid substring hijacks
      const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (regex.test(t)) return intent;
    }
  }

  return null; // no match
}

// =======================
// MAIN RESPONSE FUNCTION
// =======================
function getBotResponse(userInput) {
  const lower = userInput.toLowerCase();
  const tokens = tokenizer.tokenize(lower);
  const combined = tokens.join(" ");

  // 1️⃣ Check keywords first
  let intent = detectByKeywords(lower);

  // 2️⃣ If no keyword matched → fallback
  if (!intent) return "Sorry, I don’t understand.";

  // 3️⃣ Special logic for social engineering, phishing, malware
  if (intent === "social_engineering") {
    if (lower.includes("what is")) return responses.social_engineering.definition;
    if (lower.includes("avoid") || lower.includes("prevent")) return responses.social_engineering.prevention;
    if (lower.includes("example")) return responses.social_engineering.examples;
    return responses.social_engineering.definition;
  }

  if (intent === "phishing") {
    if (lower.includes("what is")) return responses.phishing.definition;
    if (lower.includes("avoid") || lower.includes("prevent")) return responses.phishing.prevention;
    if (lower.includes("example")) return responses.phishing.examples;
    return responses.phishing.definition;
  }

  if (intent === "malware") {
    if (lower.includes("what is")) return responses.malware.definition;
    if (lower.includes("prevent")) return responses.malware.prevention;
    if (lower.includes("remove")) return responses.malware.removal;
    return responses.malware.definition;
  }

  // 4️⃣ Return general response
  return responses[intent] || "Sorry, I don’t understand.";
}

// =======================
// Export
// =======================
module.exports = {
  getBotResponse,
  trainingData,
  responses,
  classifier
};

// =======================
// Demo
// =======================
if (require.main === module) {
  console.log(getBotResponse("how to avoid phishing")); // ✅ Phishing response
  console.log(getBotResponse("hi there")); // ✅ Greeting
  console.log(getBotResponse("tell me a joke")); // ✅ Sorry, I don’t understand.
}
