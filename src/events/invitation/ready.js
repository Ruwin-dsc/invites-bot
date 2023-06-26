const { Events } = require("discord.js")

module.exports = {
    name: Events.Ready,
    async execute(client) {
        client.guilds.cache.forEach(async guild => {
            let invites = await guild.invites.fetch()
            if (guild.vanityURLCode) invites.set(guild.vanityURLCode, await guild.fetchVanityData());
            client.guildInvites.set(guild.id, invites);

        });
    }
}