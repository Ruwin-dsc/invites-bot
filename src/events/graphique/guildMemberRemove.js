const { Events } = require("discord.js")

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client, member) {
        const stats = await client.db.get(`graph_${member.guild.id}`).then(d => {
            if (!d) return [{ time: Date.now(), joins: 0, leaves: 1, members: member.guild.memberCount }];
            return [...d, { time: Date.now(), joins: 0, leaves: 1, members: member.guild.memberCount }]
        })
        await client.db.set(`graph_${member.guild.id}`, stats);
    }
}
