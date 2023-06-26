const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
class command {
    constructor() {
        this.name = "bonus"
        this.description = "Permets d'ajouter des invitations a un membre"
        this.permissions = "Administrator"
        this.maintenance = false
        this.category = "Configuration"
        this.options = [
            { name: "user", description: "Utilisateur", required: true, type: 6 },
            { name: "number", description: "Nombre d'invitations", required: true, type: 3 },

        ]

    }

    async execute(client, interaction) {
        const user = interaction.options.getUser("user")
        const number = interaction.options.getString("number")
        const data = await client.db.get(`invites_${interaction.guild.id}_${user.id}`) || {
            total: 0,
            valid: 0,
            left: 0,
            bonus: 0
        }
        await client.db.set(`invites_${interaction.guild.id}_${user.id}`, {
            total: data.total + parseInt(number),
            valid: data.valid,
            left: data.left,
            bonus: data.bonus + parseInt(number)
        })
        return interaction.reply(`:white_check_mark: **${number}** ${await client.lang('config.bonus', interaction.user.id)} ${user} !`)
    }
}

module.exports = command