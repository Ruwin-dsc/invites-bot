const { Events } = require("discord.js")

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client, member) {
        if (member.partial) member = await member.fetch();
        const data = await client.db.get(`invitesconfig.${member.guild.id}`)
        let welcomeChannel = await client.channels.fetch(data?.goodbyelounge).catch(err => { });
        if (member.user.bot && welcomeChannel) return welcomeChannel.send(`Le bot ${member.toString()} nous a quitter, il avait rejoins en utilisant ***l'api OAuth2***`).catch(err => { });
        let user = await client.db.get(`invitedby_${member.guild.id}_${member.id}`);
        if (user === null && welcomeChannel) return welcomeChannel.send(`**${member.user.tag}** a quitter le serveur, mais **je n'arrive pas à trouver** comment il l'avait rejoint.`);
        if (user === 'vanity' && welcomeChannel) return welcomeChannel.send(`**${member.user.tag}** nous a quitter il avais rejoint en utilisant ***le lien d'invitation personnalisé du serveur.**`);
        let iv2 = await client.users.fetch(user).catch(err => { });
        const invitesOfUser = await client.db.get(`invites_${member.guild.id}_${user.id}`) || {
            total: 0,
            valid: 0,
            left: 0,
            bonus: 0
        }
        const newInvites = {
            total: invitesOfUser.total - 1,
            valid: invitesOfUser.valid - 1,
            left: invitesOfUser.left + 1,
            bonus: invitesOfUser.bonus
        }
        await client.db.set(`invites_${member.guild.id}_${user.id}`, newInvites)


        let leavemssage = data?.goodbyemsg
        if (leavemssage === null) return

        let toSend = leavemssage?.replace('{userId}', member.user.id)
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
