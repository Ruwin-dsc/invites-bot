const { Events } = require("discord.js");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        let channels = await client.db.get(`ghostpings_${member.guild.id}`)
        if (!channels) return
        for (const channelId of channels) {
            const channel = member.guild.channels.cache.get(channelId)
            channel?.send(`${member}`).then((m) => m.delete()).catch(e => { })
        }
    }
}