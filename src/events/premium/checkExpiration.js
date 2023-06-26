const { Events } = require("discord.js")

module.exports = {
    name: Events.Ready,
    async execute(client) {


        // Récupérer toutes les entrées de la base de données
        // Récupérer toutes les entrées de la base de données
        const entries = await client.db.all().map(entry => ({
            premiumId: entry.ID,
            expiration: new Date(entry.data),
        }));

        // Filtrer les entrées pour ne conserver que les membres premium dont la date d'expiration n'est pas passée
        const validEntries = entries.filter(entry => entry.expirationDate > new Date());

        // Supprimer les entrées pour les membres dont la date d'expiration est passée
        const invalidEntries = entries.filter(entry => entry.expirationDate <= new Date());
        for (const entry of invalidEntries) {
            db.delete(entry.premiumId);
        }
    }
}