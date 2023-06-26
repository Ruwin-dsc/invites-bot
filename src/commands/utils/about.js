const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
class command {
    constructor() {
        this.name = "about"
        this.description = "Permets de voir les informations du bot."
        this.category = "Util"
    }

    async execute(client, interaction) {
        const djs = require("discord.js").version;
        const node = process.version;
        const users = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
        let embed = {
            title: `About ${client.user.username}`,
            fields: [
                { name: `Teams`, value: `<@285417432288591874> - <@350005907284819968> - <@283389910105456642> - <@341573754616283136> <@251814610154422272>`, inline: true },
                { name: `Discord.js`, value: `\`${djs}\``, inline: true },
                { name: `Node.js`, value: `\`${node}\``, inline: true },
                { name: `Servers`, value: `\`${client.guilds.cache.size}\``, inline: true },
                { name: `Users`, value: `\`${users}\``, inline: true },
                { name: `Ping`, value: `\`${client.ws.ping}ms\``, inline: true },
                { name: `Support`, value: `[Click here](https://discord.gg/qGR7tvjZmt)`, inline: true },
            ],
            color: "5793265",
            url: "https://discord.gg/qGR7tvjZmt",
            image: {
                url: "https://media.discordapp.net/attachments/1033794359126147123/1105579565025329202/barreinvite.png?width=1200&height=118"
            }
        }
        interaction.reply({ embeds: [embed] });
    }
}
module.exports = command