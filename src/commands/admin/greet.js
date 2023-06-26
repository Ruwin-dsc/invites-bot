const { EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder } = require('discord.js');

class command {
    constructor() {
        this.name = "greet"
        this.description = "Permets de configurer les ghostpings"
        this.permissions = "Administrator"
        this.category = "Admin"

    }

    async execute(client, interaction) {
        let ghostpings = await client.db.get(`ghostpings_${interaction.guild.id}`) || []
        let number = 0;
        const buttons = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder({ emoji: "➕", custom_id: "add", style: 3 }),
                new ButtonBuilder({ label: ghostpings.length || "0", custom_id: "number", disabled: true, style: 2 }),
                new ButtonBuilder({ emoji: "➖", custom_id: "del", style: 4 }),
            )

        const message = await interaction.reply({ embeds: [embed()], components: [buttons], fetchReply: true });
        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 120000
        })
        collector.on("collect", async (button) => {
            const value = button.customId;
            if (value === "add") {
                await button.reply({ content: "<:channel:1107049196323876935>" + await client.lang('admin.greetChannel', interaction.user.id), fetchReply: true });
                msgCollector().on("collect", async (response) => {
                    const channel = getChannel(response, response.content);
                    if (!channel || channel.type !== 0 && channel.type !== 5) return error(response, "<:no:1107240009746096138>");
                    ghostpings.push(channel.id);
                    update(response);
                })
            } else if (value === "del") {
                if (ghostpings.length === 0) return button.reply({ content: "<:no:1107240009746096138>", ephemeral: true });
                let menu = new StringSelectMenuBuilder().setCustomId("menu-del-ghostping").setPlaceholder("Greet")
                for await (const channelId of ghostpings) {
                    menu.addOptions({ label: interaction.guild.channels.cache.get(channelId)?.name || channelId, value: channelId })
                }
                const reply = await button.reply({ components: [new ActionRowBuilder().setComponents(menu)], fetchReply: true });
                const response = await reply.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 600000
                });
                ghostpings = ghostpings.filter(c => c !== response.values[0]);
                update()
            } else if (value === "clear") {
                const buttonsYesOrNo = new ActionRowBuilder().setComponents(
                    new ButtonBuilder({ label: "Yes", style: 3, custom_id: "yes" }),
                    new ButtonBuilder({ label: "No", style: 4, custom_id: "no" })
                )
                const reply = await button.reply({ content: await client.lang('admin.greetValid', interaction.user.id), fetchReply: true, components: [buttonsYesOrNo] })
                const response = await reply.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 600000
                });
                if (response.customId === "yes") {
                    ghostpings = [];
                    update()
                } else {
                    update()
                }
            }
            function getChannel(ctx, arg) {
                return ctx.mentions.channels.first() || ctx.guild.channels.cache.get(arg) || ctx.guild.channels.cache.find((c) => c.name.toLowerCase().includes(arg.toLowerCase()))
            }
            function msgCollector() {
                return interaction.channel.createMessageCollector({
                    filter: (m) => m.author.id === interaction.user.id,
                    max: 1,
                    time: 60000
                })
            }
            function error(response, content) {
                response.reply(content).then((m) => setTimeout(() => (m.delete(), response.delete(), button.deleteReply()), 3000))
            }
            async function update(response) {
                interaction.editReply({ embeds: [embed()] })
                response?.delete().catch((e) => { })
                button.deleteReply().catch((e) => { })
                await client.db.set(`ghostpings_${interaction.guild.id}`, ghostpings)
            }
        })
        function embed() {
            return {
                title: "<:search:1107239974341971999> Actions de bienvenue",
                description: `\n${ghostpings.map(function (c, index) { return `\`${index + 1}.\` <#${c}>` }).splice(0, 15).join("\n") || "\`\`\`N/A\`\`\`"}`,
                color: client.config.clients.color,
                footer: { text: client.config.clients.name, iconURL: client.config.clients.logo },
            }
        }
    }
}
module.exports = command