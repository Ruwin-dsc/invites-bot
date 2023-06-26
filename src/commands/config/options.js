const { EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType } = require('discord.js');

class command {
    constructor() {
        this.name = "options"
        this.description = "Permets de configurer la gestion d'invitations"
        this.permissions = "Administrator"
        this.category = "Configuration"
    }

    async execute(client, interaction) {
        const data = await client.db.get(`invitesconfig.${interaction.guild.id}`)
        /*
         const description = await client.lang('inviteconfig.embeddescription', interaction.user.id)
          .replace('{guildname}', interaction.guild.name)
          .replace('{welcomelounge}', data?.welcomelounge ? `<#${data?.welcomelounge}>` : await client.lang('inviteconfig.undefined', interaction.user.id))
          .replace('{welcomemsg}', data?.welcomemsg ? `${data?.welcomemsg}` : await client.lang('inviteconfig.undefined', interaction.user.id))
          .replace('{goodbyelounge}', data?.goodbyelounge ? `<#${data?.goodbyelounge}>` : await client.lang('inviteconfig.undefined', interaction.user.id))
          .replace('{goodbyemsg}', data?.goodbyemsg ? `${data?.goodbyemsg}` : await client.lang('inviteconfig.undefined', interaction.user.id))
        */
        const embed2 = new EmbedBuilder()
            .setTitle('Configuration du serveur ' + interaction.guild.name)
            .addFields({
                name: '`📥` Salon de bienvenue:',
                value: data?.welcomelounge ? '<#' + data.welcomelounge + '>' : '```Aucun```',
                inline: true
            }, {
                name: ' ',
                value: ' ',
                inline: true
            }, {
                name: '`📤` Salon d\'adieu',
                value: data?.goodbyelounge ? '<#' + data.goodbyelounge + '>' : '```Aucun```',
                inline: true
            }, {
                name: '`📪` Message de bienvenue',
                value: data?.welcomemsg ? '```' + data.welcomemsg + '```' : '```Aucun```',
                inline: true
            }, {
                name: ' ',
                value: ' ',
                inline: true
            }, {
                name: '`📭` Message d\'adieu',
                value: data?.goodbyemsg ? '```' + data.goodbyemsg + '```' : '```Aucun```',
                inline: true
            })
            .setColor("#829AEB")

        const embed = {
            description: `✉️ **Configuration du serveur ${interaction.guild.name}**\n\n\`📥\` Salon de bienvenue:\n ${data?.welcomelounge ? `?#${data?.welcomelounge}>` : "Aucun"}\n\`📪\` Message de bienvenue:\n ${data?.welcomemsg ? `${data?.welcomemsg}` : "Aucun"}\n\`📤\` Salon d'au revoir:\n ${data?.goodbyelounge ? `<#${data?.goodbyelounge}>` : "Aucun"}\n\`📭\` Message d'au revoir:\n ${data?.goodbyemsg ? `${data?.goodbyemsg}` : "Aucun"}`,
            color: client.config.clients.color,
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('bvnchannel')
                    .setStyle(ButtonStyle.Success)
                    .setLabel(await client.lang('inviteconfig.welcomelounge', interaction.user.id)),

                new ButtonBuilder()
                    .setCustomId('bvnmsg')
                    .setStyle(ButtonStyle.Success)
                    .setLabel(await client.lang('inviteconfig.welcomemsg', interaction.user.id))
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('leavechannel')
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(await client.lang('inviteconfig.goodbyelounge', interaction.user.id)),

                new ButtonBuilder()
                    .setCustomId('leavemsg')
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(await client.lang('inviteconfig.goodbyemsg', interaction.user.id))
            )

        const msg = await interaction.reply({ embeds: [embed2], components: [row, row2], fetchReply: true })
        const collector = msg.channel.createMessageComponentCollector({
            componentType: ComponentType.Button
        })

        collector.on('collect', async c => {
            if (c.customId === 'bvnmsg') {
                if (c.user.id !== interaction.user.id) return
                await c.reply({ content: await client.lang('inviteconfig.askwelcomemsg', interaction.user.id), fetchReply: true }).then(ms => {
                    ms.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 }).then(async cl => {
                        ms.delete()
                        cl.first().delete()
                        const data = await client.db.get(`invitesconfig.${interaction.guild.id}`)
                        await client.db.set(`invitesconfig.${interaction.guild.id}`, {
                            welcomemsg: cl.first().content,
                            welcomelounge: data?.welcomelounge ? data?.welcomelounge : undefined,
                            goodbyelounge: data?.goodbyelounge ? data?.goodbyelounge : undefined,
                            goodbyemsg: data?.goodbyemsg ? data?.goodbyemsg : undefined
                        })
                        const dataafterupdate = await client.db.get(`invitesconfig.${interaction.guild.id}`)
                        const embedd = new EmbedBuilder()
                            .setTitle('Configuration du serveur ' + interaction.guild.name)
                            .addFields({
                                name: '`📥` Salon de bienvenue:',
                                value: dataafterupdate?.welcomelounge ? '<#' + dataafterupdate.welcomelounge + '>' : '```Aucun```',
                                inline: true
                            }, {
                                name: ' ',
                                value: ' ',
                                inline: true
                            }, {
                                name: '`📤` Salon d\'adieu',
                                value: dataafterupdate?.goodbyelounge ? '<#' + dataafterupdate.goodbyelounge + '>' : '```Aucun```',
                                inline: true
                            }, {
                                name: '`📪` Message de bienvenue',
                                value: dataafterupdate?.welcomemsg ? '```' + dataafterupdate.welcomemsg + '```' : '```Aucun```',
                                inline: true
                            }, {
                                name: ' ',
                                value: ' ',
                                inline: true
                            }, {
                                name: '`📭` Message d\'adieu',
                                value: dataafterupdate?.goodbyemsg ? '```' + dataafterupdate.goodbyemsg + '```' : '```Aucun```',
                                inline: true
                            })
                            .setColor("#829AEB")

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('bvnchannel')
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel(await client.lang('inviteconfig.welcomelounge', interaction.user.id)),

                                new ButtonBuilder()
                                    .setCustomId('bvnmsg')
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel(await client.lang('inviteconfig.welcomemsg', interaction.user.id))
                            )

                        const row2 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('leavechannel')
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel(await client.lang('inviteconfig.goodbyelounge', interaction.user.id)),

                                new ButtonBuilder()
                                    .setCustomId('leavemsg')
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel(await client.lang('inviteconfig.goodbyemsg', interaction.user.id))
                            )
                        await msg.edit({ embeds: [embedd], components: [row, row2] })
                    })
                })
            }
            if (c.customId === 'bvnchannel') {
                if (c.user.id !== interaction.user.id) return
                await c.reply({ content: await client.lang('inviteconfig.askwelcomelounge', interaction.user.id), fetchReply: true }).then(ms => {
                    ms.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 }).then(async cl => {
                        ms.delete()
                        cl.first().delete()
                        const ch = cl.first().mentions.channels.first() || ms.guild.channels.cache.get(cl.first().content)
                        if (!ch) return ms.channel.send(':x:')
                        const data = await client.db.get(`invitesconfig.${interaction.guild.id}`)
                        await client.db.set(`invitesconfig.${interaction.guild.id}`, {
                            welcomemsg: data?.welcomemsg ? data?.welcomemsg : undefined,
                            welcomelounge: ch.id,
                            goodbyelounge: data?.goodbyelounge ? data?.goodbyelounge : undefined,
                            goodbyemsg: data?.goodbyemsg ? data?.goodbyemsg : undefined
                        })
                        const dataafterupdate = await client.db.get(`invitesconfig.${interaction.guild.id}`)
                        const embedd = new EmbedBuilder()
                            .setTitle('Configuration du serveur ' + interaction.guild.name)
                            .addFields({
                                name: '`📥` Salon de bienvenue:',
                                value: dataafterupdate?.welcomelounge ? '<#' + dataafterupdate.welcomelounge + '>' : '```Aucun```',
                                inline: true
                            }, {
                                name: ' ',
                                value: ' ',
                                inline: true
                            }, {
                                name: '`📤` Salon d\'adieu',
                                value: dataafterupdate?.goodbyelounge ? '<#' + dataafterupdate.goodbyelounge + '>' : '```Aucun```',
                                inline: true
                            }, {
                                name: '`📪` Message de bienvenue',
                                value: dataafterupdate?.welcomemsg ? '```' + dataafterupdate.welcomemsg + '```' : '```Aucun```',
                                inline: true
                            }, {
                                name: ' ',
                                value: ' ',
                                inline: true
                            }, {
                                name: '`📭` Message d\'adieu',
                                value: dataafterupdate?.goodbyemsg ? '```' + dataafterupdate.goodbyemsg + '```' : '```Aucun```',
                                inline: true
                            })
                            .setColor("#829AEB")


                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('bvnchannel')
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel(await client.lang('inviteconfig.welcomelounge', interaction.user.id)),

                                new ButtonBuilder()
                                    .setCustomId('bvnmsg')
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel(await client.lang('inviteconfig.welcomemsg', interaction.user.id))
                            )

                        const row2 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('leavechannel')
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel(await client.lang('inviteconfig.goodbyelounge', interaction.user.id)),

                                new ButtonBuilder()
                                    .setCustomId('leavemsg')
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel(await client.lang('inviteconfig.goodbyemsg', interaction.user.id))
                            )
                        await msg.edit({ embeds: [embedd], components: [row, row2] })
                    })
                })
            }
            if (c.customId === 'leavechannel') {
                if (c.user.id !== interaction.user.id) return
                await c.reply({ content: await client.lang('inviteconfig.goodbyelounge', interaction.user.id), fetchReply: true }).then(ms => {
                    ms.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 }).then(async cl => {
                        ms.delete()
                        cl.first().delete()
                        const ch = cl.first().mentions.channels.first() || ms.guild.channels.cache.get(cl.first().content)
                        if (!ch) return ms.channel.send(':x:')
                        const data = await client.db.get(`invitesconfig.${interaction.guild.id}`)
                        await client.db.set(`invitesconfig.${interaction.guild.id}`, {
                            welcomemsg: data?.welcomemsg ? data?.welcomemsg : undefined,
                            welcomelounge: data?.welcomelounge ? data?.welcomelounge : undefined,
                            goodbyelounge: ch.id,
                            goodbyemsg: data?.goodbyemsg ? data?.goodbyemsg : undefined
                        })
                        const dataafterupdate = await client.db.get(`invitesconfig.${interaction.guild.id}`)
                        const embedd = new EmbedBuilder()
                            .setTitle('Configuration du serveur ' + interaction.guild.name)
                            .addFields({
                                name: '`📥` Salon de bienvenue:',
                                value: dataafterupdate?.welcomelounge ? '<#' + dataafterupdate.welcomelounge + '>' : '```Aucun```',
                                inline: true
                            }, {
                                name: ' ',
                                value: ' ',
                                inline: true
                            }, {
                                name: '`📤` Salon d\'adieu',
                                value: dataafterupdate?.goodbyelounge ? '<#' + dataafterupdate.goodbyelounge + '>' : '```Aucun```',
                                inline: true
                            }, {
                                name: '`📪` Message de bienvenue',
                                value: dataafterupdate?.welcomemsg ? '```' + dataafterupdate.welcomemsg + '```' : '```Aucun```',
                                inline: true
                            }, {
                                name: ' ',
                                value: ' ',
                                inline: true
                            }, {
                                name: '`📭` Message d\'adieu',
                                value: dataafterupdate?.goodbyemsg ? '```' + dataafterupdate.goodbyemsg + '```' : '```Aucun```',
                                inline: true
                            })
                            .setColor("#829AEB")

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('bvnchannel')
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel(await client.lang('inviteconfig.welcomelounge', interaction.user.id)),

                                new ButtonBuilder()
                                    .setCustomId('bvnmsg')
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel(await client.lang('inviteconfig.welcomemsg', interaction.user.id))
                            )

                        const row2 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('leavechannel')
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel(await client.lang('inviteconfig.goodbyelounge', interaction.user.id)),

                                new ButtonBuilder()
                                    .setCustomId('leavemsg')
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel(await client.lang('inviteconfig.goodbyemsg', interaction.user.id))
                            )
                        await msg.edit({ embeds: [embedd], components: [row, row2] })
                    })
                })
            }
            if (c.customId === 'leavemsg') {
                if (c.user.id !== interaction.user.id) return
                await c.reply({ content: await client.lang('inviteconfig.goodbyemsg', interaction.user.id), fetchReply: true }).then(ms => {
                    ms.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1 }).then(async cl => {
                        ms.delete()
                        cl.first().delete()
                        const data = await client.db.get(`invitesconfig.${interaction.guild.id}`)
                        await client.db.set(`invitesconfig.${interaction.guild.id}`, {
                            welcomemsg: data?.welcomemsg ? data?.welcomemsg : undefined,
                            welcomelounge: data?.welcomelounge ? data?.welcomelounge : undefined,
                            goodbyelounge: data?.goodbyelounge ? data?.goodbyelounge : undefined,
                            goodbyemsg: cl.first().content
                        })
                        const dataafterupdate = await client.db.get(`invitesconfig.${interaction.guild.id}`)
                        const embedd = new EmbedBuilder()
                            .setTitle('Configuration du serveur ' + interaction.guild.name)
                            .addFields({
                                name: '`📥` Salon de bienvenue:',
                                value: dataafterupdate?.welcomelounge ? '<#' + dataafterupdate.welcomelounge + '>' : '```Aucun```',
                                inline: true
                            }, {
                                name: ' ',
                                value: ' ',
                                inline: true
                            }, {
                                name: '`📤` Salon d\'adieu',
                                value: dataafterupdate?.goodbyelounge ? '<#' + dataafterupdate.goodbyelounge + '>' : '```Aucun```',
                                inline: true
                            }, {
                                name: '`📪` Message de bienvenue',
                                value: dataafterupdate?.welcomemsg ? '```' + dataafterupdate.welcomemsg + '```' : '```Aucun```',
                                inline: true
                            }, {
                                name: ' ',
                                value: ' ',
                                inline: true
                            }, {
                                name: '`📭` Message d\'adieu',
                                value: dataafterupdate?.goodbyemsg ? '```' + dataafterupdate.goodbyemsg + '```' : '```Aucun```',
                                inline: true
                            })
                            .setColor("#829AEB")


                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('bvnchannel')
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel(await client.lang('inviteconfig.welcomelounge', interaction.user.id)),

                                new ButtonBuilder()
                                    .setCustomId('bvnmsg')
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel(await client.lang('inviteconfig.welcomemsg', interaction.user.id))
                            )

                        const row2 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('leavechannel')
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel(await client.lang('inviteconfig.goodbyelounge', interaction.user.id)),

                                new ButtonBuilder()
                                    .setCustomId('leavemsg')
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel(await client.lang('inviteconfig.goodbyemsg', interaction.user.id))
                            )
                        await msg.edit({ embeds: [embedd], components: [row, row2] })
                    })
                })
            }
        })
    }
}
module.exports = command