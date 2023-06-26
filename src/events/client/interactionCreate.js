const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (interaction.channel === null) return
        if (!interaction.isCommand()) return
        const command = client.commands.get(interaction.commandName);
        const use = await client.db.get(`bot_${interaction.member.id}`)
        const premium = await client.db.get(`premium_${interaction.guild.id}`)
        if (use === null || !use) {
            interaction.member.send({ files: ["https://media.discordapp.net/attachments/1106239282445828177/1106239586134409297/image_2023-05-11_1715239932.png?width=1090&height=261"] })
            client.db.set(`bot_${interaction.member.id}`, true)
        }
        if (command.maintenance === true && !client.config.clients.devs.includes(interaction.member.id.toString())) return interaction.reply({ content: `Seulement les développeurs peuvent utiliser cette commande`, ephemeral: true, });
        if (command.permissions && !interaction.member.permissions.has(command.permissions) && !client.config.clients.devs.includes(interaction.member.id.toString())) return interaction.reply({ content: `Vous n'avez pas la permission d'utiliser cette commande`, ephemeral: true, });
        if (command.premium && premium?.etat != true) return interaction.reply({ content: `<:idea:1107239976569159721> Cette fonctionnalité est **une option premium**`, ephemeral: false, });
        if (!client.commands.has(interaction.commandName)) return
        try {
            client.commands.get(interaction.commandName).execute(client, interaction)
            console.log('\x1b[32m' + 'La commande ' + '\x1b[35m' + `${interaction.commandName}` + '\x1b[32m' + ' vient d\'être utilisée par ' + `${interaction.user.tag}`)

        } catch (error) {
            console.error(error)
        }
    }
}