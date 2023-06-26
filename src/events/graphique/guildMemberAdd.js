const { Events } = require("discord.js")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        const stats = await client.db.get(`graph_${member.guild.id}`).then(d => {
            if (!d) return [{ time: Date.now(), joins: 1, leaves: 0, members: member.guild.memberCount }];
            return [...d, { time: Date.now(), joins: 1, leaves: 0, members: member.guild.memberCount }]
        })
        await client.db.set(`graph_${member.guild.id}`, stats);
    }
}
