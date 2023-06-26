const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
class command {
    constructor() {
        this.name = "variables"
        this.description = "Permets de voir les variables pour le système de gestion d'invitations."
        this.permissions = "Administrator"
        this.category = "Configuration"
    }

    async execute(client, interaction) {
        let embed = {
            title: `${await client.lang('config.variables', interaction.user.id)} ${client.user.username}`,
            fields: [
                { name: "{user}", value: "Le membre ayant quitté/rejoint" },
                { name: "{userUsername}", value: "Le pseudo du membre" },
                { name: "{inviter}", value: "L'inviter ayant invité le membre" },
                { name: "{inviterUsername}", value: "Le pseudo de l'inviter" },
                { name: "{inviterInvitations}", value: "Nombre d'invites de l'inviter" },
                { name: "{guildName}", value: "Nom du serveur", },
                { name: "{guildCount}", value: "Nombre de membres du serveur", },
            ],
            color: client.config.clients.color,
            url: "https://discord.gg/qGR7tvjZmt",
            image: {
                url: "https://media.discordapp.net/attachments/1033794359126147123/1105579565025329202/barreinvite.png?width=1200&height=118"
            }
        }
        interaction.reply({ embeds: [embed] });
    }
}
module.exports = command