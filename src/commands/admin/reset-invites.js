const { EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType } = require('discord.js');

class command {
    constructor() {
        this.name = "reset-invites"
        this.description = "Permets de réinitialiser les invitations"
        this.permissions = "Administrator"
        this.category = "Admin"

    }

    async execute(client, interaction) {
        const data = await client.db.get(`invitesconfig.${interaction.guild.id}`)

        const embed = new EmbedBuilder()
            .setDescription(`Vous voulez vraiment supprimé toute les invitations du serveur?`)
            .setColor('Green')

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yes')
                    .setStyle(ButtonStyle.Success)
                    .setLabel(await client.lang('inviteconfig.resetYes', interaction.user.id)),

                new ButtonBuilder()
                    .setCustomId('no')
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(await client.lang('inviteconfig.resetNo', interaction.user.id))
            )


        const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
        const collector = msg.channel.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            componentType: ComponentType.Button
        })

        collector.on('collect', async c => {
            if (c.customId === 'yes') {
                c.reply(`<:timer2:1107049223406485545> ${await client.lang('inviteconfig.resetSucces', interaction.user.id)}`)
                interaction.deleteReply()
                interaction.guild.members.cache.map(async member => {
                    await client.db.delete(`invites_${interaction.guild.id}_${member.user.id}`)
                })
            } else if (c.customId === 'no') {
                c.reply(`<:timer2:1107049223406485545> ${await client.lang('inviteconfig.resetStop', interaction.user.id)}`)
                interaction.deleteReply()
            }


        })
    }
}
module.exports = command