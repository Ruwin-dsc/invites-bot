const { Events } = require("discord.js")

module.exports = {
    name: Events.GuildDelete,
    async execute(client, guild) {
        console.log('\x1b[31m' + `Le serveur ` + '\x1b[37m' + `${guild.name} ` + '\x1b[31m' + 'vient de m\'expulser, il possède ' + '\x1b[37m' + `${guild.memberCount} membres`)
        let embed = {
            title: `${guild.name}`,
            color: client.config.clients.color,
            footer: { text: client.config.clients.name, iconURL: client.config.clients.logo },
            description: ` \`${guild.name}\` vient de m'expulser, je suis donc sur ${client.guilds.cache.size} serveurs`,
            fields: [
                { name: 'ID', value: `${guild.id}` },
                { name: 'Members', value: `${guild.memberCount} | ${guild.members.cache.filter((m) => m.user.bot).size} bots`, inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}> ( ${guild.ownerId})`, inline: true },],
        }
        client.guilds.cache.get("686602630528499754").channels.cache.get("1106670002695839885").send({ embeds: [embed] })
    }
}