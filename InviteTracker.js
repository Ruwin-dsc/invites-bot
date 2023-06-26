const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { QuickDB } = require("quick.db");

  const db = new QuickDB();



const fs = require("fs")
const client = new Client({
    intents: [
        Object.values(GatewayIntentBits)
    ]
});

process.on("uncaughtException", (e) => {
    if (e.code === 50013) return;
    if (e.code === 10062) return;
    console.log(e)
})
process.on("unhandledRejection", (e) => {
    if (e.code === 50013) return;
    if (e.code === 10062) return;
    console.log(e)
})

client.guildInvites = new Map();
client.config = require('./config');
client.commands = new Collection()
client.db = db

client.lang = async function (key, serveur) {
    const langCode = await client.db.get(`config.${serveur}`) || { langue: "fr" }
    const langFilePath = `./langues/${langCode.langue}.json`;
    if (!fs.existsSync(langFilePath)) {
        console.error('Error: Language non trouvé', langFilePath);
        return `Je ne trouve pas le fichier: ${langCode}]`;
    }
    const keys = key.split('.');
    let text = require(langFilePath);
    for (const key of keys) {
        text = text[key];
        if (!text) {
            console.error(`Pas de traduction pour "${key}", langue : ${langCode}`);
            return `Pas de traduction : ${key}]`;
        }
    }

    return text;

};
require('./src/structure/handler/event')(client);
require('./src/structure/handler/command')(client);
client.login(client.config.clients.token);