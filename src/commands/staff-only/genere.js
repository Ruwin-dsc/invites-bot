const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
class command {
    constructor() {
        this.name = "genere"
        this.description = "Permets de donner le premium a un utilisateur."
        this.category = "Util"
        this.maintenance = true
        this.options = [
            { name: "utilisateur", description: "Utilisateur", required: true, type: 6 },
        ]

    }

    async execute(client, interaction) {
        const user = interaction.options.getUser("utilisateur");
        const data = await client.db.get(`premium_${user.id}`)
        const now = Date.now();
        const oneMonthFromNow = new Date(now).setMonth(new Date(now).getMonth() + 1) / 1000;
        if(data?.premium === true) return interaction.reply({content: `<:exclamation:1107239995825209425> ${interaction.user.username}, **${user.username}** possède déjà un abonnement premium`})

        await client.db.set(`premium_${user.id}`, { premium: true, expiration: oneMonthFromNow});

        interaction.reply({ content: `<:config:1107049220629856378> ${interaction.user.username}, ${user.username} vient de recevoir le premium pendant **1 mois**` });
    }
}

module.exports = command