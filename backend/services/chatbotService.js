//import natural library
const natural = require('natural');

//tokenizer will split the user's input into words
const tokenizer = new natural.WordTokenizer();


//training data
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


//responses
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


//create a naive bayes classifier
const classifier = new natural.BayesClassifier();

//train the classifier, each phrase is mapped to its intent
for (const intent in trainingData) {
  trainingData[intent].forEach(phrase => {
    classifier.addDocument(phrase.toLowerCase(), intent);
  });
}

classifier.train();

//function to detect intent by exact keyword matching and uses regex which avoids substring issues
function detectByKeywords(text) {
  const t = text.toLowerCase();

  for (const intent in trainingData) {
    for (const phrase of trainingData[intent]) {
      // Match whole words only, avoid substring hijacks
      const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (regex.test(t)) return intent;
    }
  }

  return null; //no match
}

//function to process user input and return a response
function getBotResponse(userInput) {
  const lower = userInput.toLowerCase();
  const tokens = tokenizer.tokenize(lower);
  const combined = tokens.join(" ");

//check keywords first
  let intent = detectByKeywords(lower);

//if no keyword matched -> fallback response 
  if (!intent) return "Sorry, I don’t understand.";

//special logic for social engineering, phishing, malware
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

//return general response
  return responses[intent] || "Sorry, I don’t understand.";
}

//export functions to use in other modules
module.exports = {
  getBotResponse,
  trainingData,
  responses,
  classifier
};


