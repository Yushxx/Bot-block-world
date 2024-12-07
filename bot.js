const http = require('http');
const TelegramBot = require('node-telegram-bot-api');

// Remplacez 'YOUR_API_TOKEN' par le token de votre bot
const bot = new TelegramBot('6544724506:AAHUPaz3qzlEoCzYAzQlMd_jvkRcCCqS4n4', { polling: true });

// Liste des mots-clés interdits (arnaqueurs, insultes, termes dénigrants)
const forbiddenKeywords = [
  // Mots d'arnaqueurs
  "porno", "Tu peux gagner plus de","iphone",  "gain","abonnement","Netflix","maître","rituel","magique", "aviator","229","drogue", "gagné", "coupon scores exact", "contacté moi",
  "trading", "mon company", "cashout", "plan d'investissement", 
  "maître marabout", "doublez votre argent", "multiplication d'argent",
  "investissement rapide", "garanti à 100%", "sans risque", 
  "argent facile", "jackpot","1xbet","code promo","1win","melbet","coupon", "bénédiction financière", "retour sur investissement", 
  "sécurisé à 100%", "gagner gros", "enrichissement rapide", "secrets financiers", 
  "marabout puissant", "rituel d'argent", "formule magique", "grâce divine",
  "débloquez vos finances", "fortune assurée", "100% sûr", "argent illimité",
  "contactez immédiatement", "bonus gratuit", "débloquez vos gains",
  "win big", "earn fast", "quick cash", "fortune garantie", 
  "solution miracle", "bénéfices incroyables", "revenus passifs", 
  "revenus garantis", "profitez maintenant", "opportunité unique",

  // Insultes fréquentes
  "idiot", "imbécile", "abruti", "connard", "salope", "crétin", "bouffon", 
  "batard", "enfoiré", "fils de pute", "merdeux", "clochard", "chien", 
  "va te faire foutre", "sale con", "trou du cul",

  // Termes dénigrants
  "nul","thiaga","doul","imbécile","katal","incompétent", "raté", "mauvais", "incapable", "stupide", 
  "débile", "faible", "minable", "pathétique", "médiocre", "ignorant"
];

// Liste des indicatifs téléphoniques interdits
const forbiddenPrefixes = ["+229", "+221", "+212", "+237", "+222", "+225","+234"]; // Ajoutez d'autres indicatifs si nécessaire

// Fonction pour vérifier les messages
function shouldDeleteMessage(text) {
  // Vérifie si le message contient un lien
  if (text.includes("http") || text.includes("www")) {
    return true;
  }

  // Vérifie si le message contient un numéro de téléphone ou indicatif interdit
  if (/\+\d+/.test(text)) {
    for (const prefix of forbiddenPrefixes) {
      if (text.includes(prefix)) {
        return true;
      }
    }
  }

  // Vérifie si le message contient des mots-clés interdits
  for (const keyword of forbiddenKeywords) {
    if (text.toLowerCase().includes(keyword)) {
      return true;
    }
  }

  return false;
}

// Gestionnaire pour les nouveaux messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (shouldDeleteMessage(text)) {
    bot.deleteMessage(chatId, msg.message_id)
      .then(() => {
        console.log(`Message supprimé: "${text}" de l'utilisateur ${msg.from.username || msg.from.first_name}`);
      })
      .catch((err) => console.error(`Erreur lors de la suppression du message: ${err}`));
  }
});

// Message de démarrage du bot
console.log("Bot gardien en cours d'exécution...");
// Créez un serveur HTTP simple qui renvoie "I'm alive" lorsque vous accédez à son URL
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("I'm alive");
    res.end();
});

// Écoutez le port 8080
server.listen(8080, () => {
    console.log("Keep alive server is running on port 8080");
});
