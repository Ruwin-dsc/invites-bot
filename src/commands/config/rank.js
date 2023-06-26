const {
    ComponentType,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonStyle,
    ButtonBuilder,
    RoleSelectMenuBuilder
} = require("discord.js")

class command {
    constructor() {
        this.name = "rank"
        this.description = "Permets d'ajouter des rank d'invitations"
        this.permissions = "Administrator"
        this.category = "Configuration"
    }

    async execute(client, interaction) {
        const ranksList = await client.db.get(`ranks_${interaction.guild.id}`) || []
        let counts;

        const ranks = ranksList.map(({ count, role }) => {
            const test = interaction.guild.roles.cache.get(role);
            return `<:dot:1104789411176128512> **${count} invitations**\n<:reply:1105172834302578759> ${test ? test.name : 'N/A'}`;
        }).join('\n\n');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('addRank')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`➕`),
                new ButtonBuilder()
                    .setCustomId('test')
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`${ranksList.length}`)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('delRank')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("➖")
            )
        const embed = {
            title: await client.lang('config.embedTitleInvite', interaction.user.id),
            description: ranks,
            color: client.config.clients.color,
        }
        const message = await interaction.reply({ embeds: [embed], components: [row] })
        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 120000
        })

        collector.on('collect', async c => {
            const value = c.customId;
            if (value === "addRank") {
                const reply = await c.reply({ content: `${await client.lang('config.howInvite', interaction.user.id)}` })
                const limitCollector = interaction.channel.createMessageCollector({
                    filter: (i) => i.author.id === interaction.user.id,
                    time: 120000,
                });
                limitCollector.on("collect", async (d) => {
                    limitCollector.stop();
                    const number = d.content
                        .trim()
                        ?.toLowerCase();
                    if (isNaN(number)) return error("Invalid number");
                    counts = d.content
                    let embed = {
                        description: `${await client.lang('config.choisirRole', interaction.user.id)}`,
                    };
                    let menu = new ActionRowBuilder().setComponents(
                        new RoleSelectMenuBuilder()
                            .setPlaceholder("Role")
                            .setCustomId("choose-a-role")
                    )
                    const reply = await (interaction.replied ? c.editReply({ content: "", embeds: [embed], components: [menu] }) : c.reply({ embeds: [embed], components: [menu] }))
                    const collector = reply.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 60000 });
                    collector.on("collect", async (response) => {
                        response.deferUpdate().catch((e) => { });
                        const role = await interaction.guild.roles.fetch(response.values[0]);
                        collector.stop();
                        const requiredInvites = await client.db.get(`ranks_${interaction.guild.id}`).then(d => {
                            if (!d) return [{ count: counts, role: role.id }];
                            return [...d, { count: counts, role: role.id }]
                        })
                        const newRank = await client.db.set(`ranks_${interaction.guild.id}`, requiredInvites);
                        response.deleteReply()

                        const ranks = newRank.map(({ count, role }) => {
                            const test = interaction.guild.roles.cache.get(role);
                            return `<:dot:1104789411176128512> **${count} invitations**\n<:reply:1105172834302578759> ${test ? test.name : 'N/A'}`;
                        }).join('\n\n');
                        client.db.set(`ranks_${interaction.guild.id}`, newRank);
                        const embed = {
                            title: await client.lang('config.embedTitleInvite', interaction.user.id),
                            description: ranks
                        }
                        interaction.editReply({ embeds: [embed] })
                    });
                })

            } else if (value === "delRank") {
                if (ranksList.length === 0) return d.reply({ content: `${await client.lang('config.noRank', interaction.user.id)}`, ephemeral: true });
                let menu = new StringSelectMenuBuilder().setCustomId("menu-del-rank").setPlaceholder("Invites")
                for await (const rank of ranksList) {
                    menu.addOptions({ label: `${rank.count} invites`, value: rank.role })
                }
                const reply = await c.reply({ components: [new ActionRowBuilder().setComponents(menu)], fetchReply: true });
                const response = await reply.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 600000
                });
                let newRank = await client.db.get(`ranks_${interaction.guild.id}`)

                newRank.splice(newRank.findIndex(x => x.role == response.values[0]), 1)
                const ranks = newRank.map(({ count, role }) => {
                    const test = interaction.guild.roles.cache.get(role);
                    return `<:dot:1104789411176128512> **${count} invites**\n<:reply:1105172834302578759> ${test ? test.name : 'N/A'}`;
                }).join('\n\n');
                client.db.set(`ranks_${interaction.guild.id}`, newRank);
                const embed = {
                    title: await client.lang('config.embedTitleInvite', interaction.user.id),
                    description: ranks
                }
                interaction.editReply({ embeds: [embed] })
                c.deleteReply()

            }

        })
    }
}
module.exports = command