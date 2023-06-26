const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
class command {
    constructor() {
        this.name = "invite"
        this.description = "Permets de m'ajouter sur ton magnifique serveur."
        this.category = "Util"
    }

    async execute(client, interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Bot')
                    .setEmoji('<:chain:743525361513529364>')
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
                    .setStyle(ButtonStyle.Link))

        let embed = {
            title: `${client.user.username}`,
            description: `${await client.lang('util.invite', interaction.user.id)}`,
            color: client.config.clients.color,
            footer: { text: client.config.clients.name, iconURL: client.config.clients.logo },
            image: {
                url: "https://media.discordapp.net/attachments/1033794359126147123/1105579565025329202/barreinvite.png?width=1200&height=118"
            },
        }
        interaction.reply({ embeds: [embed], components: [row] });
    }
}

module.exports = command