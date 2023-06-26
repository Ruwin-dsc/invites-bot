const { ActivityType, Events } = require('discord.js');
module.exports = {
    name: Events.ClientReady,
    execute(client) {
        client.application.commands.set(client.commands.map(({ execute, ...data }) => data))
        console.log('\x1b[33m' + `Connectés à ${client.user.username} !\n` + '\x1b[33m' + `-> Le bot est utilisé sur ${client.guilds.cache.size} serveurs !`);
        client.user.setPresence({
            activities: [{ name: client.config.clients.activity, type: ActivityType.Watching }],
            status: 'online',
        }); 
      
    }
}