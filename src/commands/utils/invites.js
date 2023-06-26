const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
class command {
    constructor() {
        this.name = "invites"
        this.description = "Permets de voir les invitations d'un membre ou de soit-même."
        this.category = "Util"
        this.options = [
            { name: "utilisateur", description: "L'utilisateur", required: false, type: 6 }
        ]

    }

    async execute(client, interaction) {
        const user = interaction.options.getUser("utilisateur") || interaction.user;
        const data = await client.db.get(`invites_${interaction.guild.id}_${user.id}`) || {
            total: 0,
            valid: 0,
            left: 0,
            bonus: 0
        }
        let embed = {
            description: `${await client.lang('invites.total', interaction.user.id)} **${data.total}** invites ( **${data.valid}** valides, **${data.bonus}** bonus, **${data.left}** leaves )`,
            color: client.config.clients.color,
            footer: { text: client.config.clients.name, iconURL: client.config.clients.logo }
        }
        interaction.reply({ embeds: [embed] });
    }
}

module.exports = command