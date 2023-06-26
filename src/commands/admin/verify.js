const { EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder } = require('discord.js');

class command {
    constructor() {
        this.name = "verify"
        this.description = "Permets de configurer le système de vérification"
        this.permissions = "Administrator"
        this.category = "Admin"
    }

    async execute(client, interaction) {
        const config = await client.db.get(`captcha_${interaction.guild.id}`) || { roles: undefined, toggle: undefined, channel: undefined }
        const message = await interaction.reply({ embeds: [embed()], components: [buttons()], fetchReply: true })

        function embed() {
            return {
                title: `Captcha`,
                color: client.config.clients.color,
                footer: { text: client.config.clients.name, iconURL: client.config.clients.logo },
                fields: [
                    { name: `<:channel:1107049196323876935> Salon`, value: config.channel ? `<#${config.channel}>` : "```❌```", inline: false },
                    { name: `<:role:1107049194528710666> Roles`, value: config.roles?.map((r) => `<@&${r}>`).join(", ") || "```❌```", inline: false },
                ]
            }
        }
        async function update() {
            interaction.editReply({ embeds: [embed()], components: [buttons()] })
            await client.db.set(`captcha_${interaction.guild.id}`, config)
        }
        function buttons() {
            return new ActionRowBuilder()
                .setComponents(
                    new ButtonBuilder({ emoji: "<:channel:1107049196323876935> ", custom_id: "channel", style: 2 }),
                    new ButtonBuilder({ emoji: "<:role:1107049194528710666>", custom_id: "role", style: 2 }),
                    new ButtonBuilder({ emoji: config.toggle ? "<:no:1107240009746096138> " : "<:check_mark:1107239970231550014>", style: config.toggle ? 4 : 3, custom_id: "toggle" })
                )
        }

        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 300000
        })
        collector.on("collect", async (collected) => {
            const value = collected.customId
            if (value === "channel") {
                const menu = new ActionRowBuilder().setComponents(
                    new ChannelSelectMenuBuilder({ customId: "channel-menu", channelTypes: [0, 5], placeholder: "Verify" })
                )
                const reply = await collected.reply({ components: [menu], fetchReply: true })
                reply.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 120000, max: 1 }).on("collect", async (response) => {
                    const channel = response.values[0];
                    if (!channel) return response.reply({ content: "❌", ephemeral: true });
                    response.deferUpdate();
                    config.channel = channel;
                    collected.deleteReply();
                    update();
                })

            } else if (value === "toggle") {
                collected.deferUpdate();
                config.toggle = config.toggle ? false : true;
                update()
            } else if (value === "role") {
                const row = new ActionRowBuilder().setComponents(
                    new RoleSelectMenuBuilder()
                        .setPlaceholder("Sélectionner un rôle")
                        .setCustomId("roles")
                )
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder({ emoji: "✅", style: 3, custom_id: "ok" })
                )
                const reply = await collected.reply({ content: `<:config:1107049220629856378> ${await client.lang('admin.verifyRole', interaction.user.id)}`, components: [row, button], fetchReply: true })
                const roles = [];
                reply.createMessageComponentCollector({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 120000
                }).on("collect", async (response) => {
                    const v = response.customId;
                    if (v === "roles") {
                        const role = response.roles.first();
                        if (role.managed) return response.reply({ content: "❌", ephemeral: true });
                        response.deferUpdate();
                        roles.push(role.id);
                        response.message.edit({ content: `<:config:1107049220629856378> ${await client.lang('admin.verifyRole', interaction.user.id)}\n${roles.map((role) => `<@&${role}>`).join(" ,") || ""}`, components: [row, button], fetchReply: true })
                    } else if (v === "ok") {
                        config.roles = roles;
                        collected.deleteReply();
                        update();
                    }
                })
            }
        })
    }
}
module.exports = command