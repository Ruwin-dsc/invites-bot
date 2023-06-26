const { EmbedBuilder } = require('discord.js');

class command {
    constructor() {
        this.name = "ping"
        this.description = "Permets de voir le ping du bot."
        this.category = "Util"
    }

    async execute(client, interaction) {

        interaction.reply({ content: `${await client.lang('util.ping', interaction.user.id)} \`${client.ws.ping}\` ms` });
    }
}
module.exports = command