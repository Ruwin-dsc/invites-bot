const { Events } = require("discord.js")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        if (member.partial) member = await member.fetch();
        const data = await client.db.get(`invitesconfig.${member.guild.id}`)
        let welcomeChannel = await client.channels.fetch(data?.welcomelounge).catch(err => { });
        if (member.user.bot && welcomeChannel) return welcomeChannel.send(`Le bot ${member.toString()} nous a rejoint en utilisant ***l'api OAuth2***`).catch(err => { });
        const newInvites = await member.guild.invites.fetch()
        if (member.guild.vanityURLCode) newInvites.set(member.guild.vanityURLCode, await member.guild.fetchVanityData());
        client.guildInvites.set(member.guild.id, newInvites);
        let usedInvite = (await member.guild.invites.fetch())
            .find(async i => await client.db.has(`invites.${i.code}`) && client.db.get(`invites.${i.code}`).uses < i.uses);
        if (!usedInvite) return welcomeChannel.send(`Je n'arrive pas à trouver comment ${member.toString()} nous rejoint le serveur.`).catch(err => { });
        if (usedInvite.code === member.guild.vanityURLCode) {
            if (welcomeChannel) welcomeChannel.send(`${member.toString()} nous a rejoint en utilisant le lien d'invitation personnalisé du serveur.`);
            await client.db.set(`invitedby_${member.guild.id}_${member.id}`, "vanity");
            return;
        };
        const invitesOfUser = await client.db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}`) || {
            total: 0,
            valid: 0,
            left: 0,
            bonus: 0
        }
        invitesOfUser.total++
        invitesOfUser.valid++
        await client.db.set(`invites_${member.guild.id}_${usedInvite.inviter.id}`, invitesOfUser)
        await client.db.set(`invitedby_${member.guild.id}_${member.id}`, usedInvite.inviter.id);

        let iv2 = usedInvite.inviter


        let joinmessage = data?.welcomemsg
        if (!data) return
        let toSend = joinmessage
            .replace('{userId}', member.user.id)
            .replace('{userTag}', member.user.tag)
            .replace('{userUsername}', member.user.tag)
            .replace('{user}', member.user)
            .replace('{inviterId}', iv2.id)
            .replace('{inviterUsername}', iv2.username)
            .replace('{inviter}', iv2)
            .replace('{inviterInvitations}', invitesOfUser.valid)
            .replace('{guildName}', member.guild.name)
            .replace('{guildId}', member.guild.id)
            .replace('{guildCount}', member.guild.memberCount)
        if (welcomeChannel) welcomeChannel.send(toSend)
    }
}
