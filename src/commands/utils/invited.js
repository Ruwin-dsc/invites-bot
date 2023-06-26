const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
class command {
    constructor() {
        this.name = "invited"
        this.description = "Permets de voir la personne qui vous a invité."
        this.category = "Util"
        this.premium = true
        this.options = [
            { name: "utilisateur", description: "Utilisateur", required: false, type: 6 }
        ]
    }

    async execute(client, interaction) {
        const user = interaction.options.getUser("utilisateur") || interaction.user;
        const invite = await client.db.get(`invitedby_${interaction.guild.id}_${user.id}`)
        const inviter = client.users.cache.get(invite)
        console.log(inviter)
        interaction.reply(inviter?  '<:questio:1107240005983809596> Vous avez été invité par **' + inviter.username + '**': "Malheureusement, je ne trouve pas par qui il a été invité.")
    }
}
module.exports = command