const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// TRAINING DATA 
const trainingData = {
  greeting: ["hi", "hello", "hey", "good morning", "good evening"],

  password: ["password", "reset password", "strong password"],
  security_tips: ["security tips", "stay safe", "protect my account"],

  two_factor: ["2fa", "two factor", "authentication", "two-step"],
  vpn: ["vpn", "virtual private network", "private network"],
  encryption: ["encryption", "encrypt", "secure data"],

  social_engineering: ["social engineering", "hackers trick"],
  phishing: ["phishing", "fake email", "scam"],

  safe_browsing: ["safe browsing", "browse safely"],
  data_privacy: ["privacy", "protect my data"],

  malware: ["malware", "virus", "ransomware"],

  firewall: ["firewall", "network wall"],
  password_manager: ["password manager", "store passwords", "manage passwords"],
  public_wifi: ["public wifi", "public wi-fi", "free wifi", "coffee shop wifi"],
  https: ["https", "secure website", "padlock icon"],
  updates: ["update", "software update", "patch", "outdated software"],
  brute_force: ["brute force", "guess password", "password attack"],

  general_chat: ["who are you", "help me", "what can you do"]
};

// RESPONSES 
const responses = {
  greeting: "Hello! How can I help you today?",

  password: "Use a strong password with a combination of uppercase letters, lowercase letters, numbers, and symbols.",
  security_tips: "Keep software updated, enable 2FA, avoid suspicious links, and use strong passwords.",

  two_factor: {
    definition: "Two-factor authentication adds extra security by requiring a second step to log in.",
    best_practices: "Enable 2FA on your major accounts (email, banking, social media).",
    how_to_use: "Install an authenticator app, scan the QR code provided by the service, and confirm the code.",
    examples: "SMS codes, authentication apps, fingerprint or face ID as the second step.",
  },

  vpn: {
    definition: "A VPN encrypts your internet traffic and hides your IP address.",
    best_practices: "Use a VPN when using public Wi-Fi or accessing sensitive data.",
    how_to_use: "Download a VPN app, log in, and connect to a secure server before browsing.",
    examples: "NordVPN, ExpressVPN, ProtonVPN."
  },

  encryption: {
    definition: "Encryption protects your data by making it unreadable without a key.",
    best_practices: "Use apps with end-to-end encryption and encrypt important files.",
    how_to_use: "Enable BitLocker or VeraCrypt for drives, or use built-in encryption options.",
    examples: "AES for file encryption, RSA for secure communication, TLS for HTTPS websites."
  },

  social_engineering: {
    definition: "Social engineering is when attackers trick people into giving information.",
    prevention: "Never share sensitive info with unverified people.",
    examples: "Fake IT support calls, scammers pretending to be banks."
  },

  phishing: {
    definition: "Phishing is when attackers impersonate trusted services to steal information.",
    prevention: "Check the sender’s address, avoid suspicious links.",
    examples: "Fake PayPal emails, Instagram login scams."
  },

  safe_browsing: "Avoid suspicious websites and make sure pages use HTTPS.",
  data_privacy: "Limit personal information you share and adjust privacy settings.",

  malware: {
    definition: "Malware is software designed to harm your device, like viruses or ransomware.",
    prevention: "Install antivirus software and avoid unknown downloads.",
    removal: "Run a trusted antivirus scan to remove malware."
  },

  firewall: {
    definition: "A firewall filters incoming and outgoing network traffic to block harmful activity.",
    best_practices: "Keep your firewall enabled on your router and computer.",
    how_to_use: "Enable the firewall in system settings and configure rules for apps or ports.",
    examples: "Windows Firewall, router firewalls, cloud firewalls."
  },

  password_manager: {
    definition: "A password manager securely stores all your passwords in one place.",
    best_practices: "Use a strong master password and enable 2FA.",
    how_to_use: "Install a password manager, create a master password, and let it generate/store new ones.",
    examples: "LastPass, 1Password, Bitwarden."
  },

  public_wifi: {
    definition: "Public Wi-Fi is often unsecured and attackers can intercept your data.",
    best_practices: "Avoid logging into accounts on public Wi-Fi, or use a VPN.",
    how_to_use: "Connect to a VPN before using public Wi-Fi, or avoid sensitive logins entirely.",
    examples: "Coffee shops, airports, malls."
  },

  https: {
    definition: "HTTPS encrypts data between your browser and the website.",
    best_practices: "Avoid entering passwords on sites without the padlock icon.",
    how_to_use: "Check for the padlock icon in your browser before entering passwords or payment details.",
    examples: "Banking websites, Google, YouTube all use HTTPS."
  },

  updates: {
    definition: "Software updates fix security vulnerabilities and bugs.",
    best_practices: "Enable automatic updates on your devices and apps.",
    examples: "iOS updates, Windows updates, browser updates."
  },

  brute_force: {
    definition: "A brute force attack is when hackers try many password combinations until they get in.",
    prevention: "Use long passwords, rate-limit login attempts, enable 2FA.",
    examples: "Password guessing bots."
  },

  general_chat: "I’m your cybersecurity assistant 🤖. You can ask me about definitions, best practices, preventions, and examples about security topics to stay safe online!" 
};

// TRAINING THE CLASSIFIER 
const classifier = new natural.BayesClassifier();
for (const intent in trainingData) {
  trainingData[intent].forEach(phrase =>
    classifier.addDocument(phrase.toLowerCase(), intent)
  );
}
classifier.train();

// KEYWORD DETECTION 
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

// SPECIAL LOGIC HANDLING 
function respondWithSpecialLogic(intent, lower, topic) {
  if (lower.includes("what is")) return topic.definition;
  if (lower.includes("avoid") || lower.includes("prevent") || lower.includes("safe")) return topic.prevention;
  if (lower.includes("example")) return topic.examples || "Here are some examples!";
  return topic.definition; // default
}

// MAIN RESPONSE FUNCTION 
function getBotResponse(userInput) {
  const lower = userInput.toLowerCase();
  let intent = detectByKeywords(lower);

  if (!intent) return "Sorry, I don’t understand.";

  // apply special logic for expanded intents
  const specialIntents = [
    "social_engineering", "phishing", "malware",
    "vpn", "two_factor", "encryption",
    "firewall", "password_manager", "public_wifi",
    "https", "updates", "brute_force"
  ];

  if (specialIntents.includes(intent)) {
    return respondWithSpecialLogic(intent, lower, responses[intent]);
  }

  // default simple response
  return responses[intent] || "Sorry, I don’t understand.";
}

module.exports = { getBotResponse, trainingData, responses, classifier };
