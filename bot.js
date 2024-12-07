const http = require('http');
const TelegramBot = require('node-telegram-bot-api');

// Remplacez 'YOUR_API_TOKEN' par le token de votre bot
const bot = new TelegramBot('6544724506:AAHUPaz3qzlEoCzYAzQlMd_jvkRcCCqS4n4', { polling: true });

// Liste des mots-clés interdits
const forbiddenKeywords = [
  "porno", "bodio","koy", "arnaqueurs", "arnaque", "c'est faux", "fake", "arnaqueur", "marche pas", "ça marche pas", "score exact",
  "Tu peux gagner plus de", "iphone", "gain", "abonnement", "Netflix", "maître", "rituel", "magique", "aviator",
  "229", "drogue", "gagné", "coupon scores exact", "contacté moi", "trading", "mon company", "cashout",
  "plan d'investissement", "maître marabout", "doublez votre argent", "multiplication d'argent", "investissement rapide",
  "garanti à 100%", "sans risque", "argent facile", "jackpot", "1xbet", "code promo", "1win", "melbet", "coupon",
  "bénédiction financière", "retour sur investissement", "sécurisé à 100%", "gagner gros", "enrichissement rapide",
  "secrets financiers", "marabout puissant", "rituel d'argent", "formule magique", "grâce divine", "débloquez vos finances",
  "fortune assurée", "100% sûr", "argent illimité", "contactez immédiatement", "bonus gratuit", "débloquez vos gains",
  "win big", "earn fast", "quick cash", "fortune garantie", "solution miracle", "bénéfices incroyables",
  "revenus passifs", "revenus garantis", "profitez maintenant", "opportunité unique", "idiot", "appel video", "sexe",
  "imbécile", "abruti", "connard", "salope", "crétin", "bouffon", "batard", "enfoiré", "fils de pute", "merdeux",
  "clochard", "chien", "va te faire foutre", "sale con", "trou du cul", "nul", "thiaga", "doul", "imbécile", "katal",
  "incompétent", "raté", "mauvais", "incapable", "stupide", "débile", "faible", "minable", "pathétique", "médiocre",
  "ignorant"
];

// Liste des indicatifs téléphoniques interdits
const forbiddenPrefixes = ["+229", "+221", "+212", "+237", "+222", "+225", "+234"];

// Expression régulière pour optimiser les recherches
const forbiddenKeywordsRegex = new RegExp(forbiddenKeywords.join("|"), "i");

// Fonction pour vérifier les messages
function shouldDeleteMessage(text) {
  if (!text) return false;

  // Vérifie si le message contient un lien
  if (text.includes("http") || text.includes("www")) return true;

  // Vérifie si le message contient un numéro de téléphone avec un indicatif interdit
  if (/\+\d+/.test(text) && forbiddenPrefixes.some(prefix => text.includes(prefix))) return true;

  // Vérifie si le message contient des mots-clés interdits
  return forbiddenKeywordsRegex.test(text);
}

// Structure pour suivre les groupes de médias déjà traités
const processedMediaGroups = new Set();

// Gestionnaire pour les nouveaux messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";
  const mediaGroupId = msg.media_group_id;

  // Gestion des groupes de médias
  if (mediaGroupId) {
    if (processedMediaGroups.has(mediaGroupId)) {
      console.log(`Messages du groupe ${mediaGroupId} déjà traités.`);
      return; // Ignorer les doublons
    }
    processedMediaGroups.add(mediaGroupId);
  }

  // Suppression des messages interdits
  if (shouldDeleteMessage(text)) {
    try {
      await bot.deleteMessage(chatId, msg.message_id);
      console.log(`Message supprimé: "${text}" de ${msg.from.username || msg.from.first_name}`);
      await sleep(300); // Délai pour éviter les limites API
    } catch (err) {
      if (err.response && err.response.statusCode === 400) {
        console.warn(`Impossible de supprimer le message : ${err.response.body.description}`);
      } else {
        console.error(`Erreur inattendue : ${err.message}`);
      }
    }
  }
});

// Fonction utilitaire pour introduire un délai
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Message de démarrage du bot
console.log("Bot gardien en cours d'exécution...");

// Créez un serveur HTTP simple pour garder le bot actif
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write("I'm alive");
  res.end();
});

// Écoutez le port 8080
server.listen(8080, () => {
  console.log("Keep alive server is running on port 8080");
});
