const { StringSelectMenuBuilder, ActionRowBuilder, chatInputApplicationCommandMention } = require('discord.js');
class command {
    constructor() {
        this.name = "premium"
        this.description = "Permets de gérer son premium"
        this.category = "Admin"
        this.maintenance = false
        this.options = [
            { name: "ajouter", description: "Permet d'ajouter le premium a un serveur", type: 1 },
            { name: "retirer", description: "Permet de retirer le premium", type: 1 },
            { name: "info", description: "Permet de voir son abonnement", type: 1 }
        ]
    }

    async execute(client, interaction) {
        const cmd = interaction.options.getSubcommand();
        if (cmd === "info") {
            const user = interaction.user;
            const data = await client.db.get(`premium_${user.id}`)
            if (!data) return interaction.reply({ content: `<:exclamation:1107239995825209425> ${interaction.user.username}, ${await client.lang('premium.notPremium', interaction.user.id)}` })

            let embed = {
                title: "Détails du forfait de " + user.tag,
                fields: [{
                    name: '`💠`・Plan:',
                    value: data?.plan ? '<#' + data.plan + '>' : '```Premium```',
                    inline: true
                }, {
                    name: ' ',
                    value: ' ',
                    inline: true
                }, {
                    name: '`🕓`・Expiration :',
                    value: data?.expiration ? `<t:` + Math.floor(data.expiration) + `:R> ` : `\`\`\`Jamais\`\`\``,
                    inline: false
                }],
                thumbnail: { url: user.displayAvatarURL({ format: 'png', size: 1024 }) },
                color: client.config.clients.color,
                footer: { text: client.config.clients.name, iconURL: client.config.clients.logo }
            }
            interaction.reply({ embeds: [embed] });
        }
        if (cmd === "ajouter") {
            const user = interaction.user;
            const data = await client.db.get(`premium_${user.id}`)
            if (!data) return interaction.reply({ content: `<:exclamation:1107239995825209425> ${interaction.user.username}, ${await client.lang('premium.notPremium', interaction.user.id)}` })
            const allRecords = await client.db.all("premium_");

            const premiumServers = allRecords.filter((record) => {
                return record.value && record.value.etat && record.value.user === interaction.user.id;
            });
            if (premiumServers.length === 2) return interaction.reply({ content: `<:no:1107240009746096138> ${await client.lang('premium.2server', interaction.user.id)}` })
            const options = client.guilds.cache
                .filter((guild) => guild.members.cache.has(user.id))
                .map((guild) => {
                    return {
                        label: guild.name,
                        value: guild.id,
                    };
                });

            if (options.length === 0) {
                interaction.reply(`${user.username}, ${await client.lang('premium.noServer2', interaction.user.id)}`);
                return;
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('common-servers')
                        .setPlaceholder('Servers')
                        .addOptions(options)
                )
            let message = await interaction.reply({ content: `<:message:1107239982764138626> ${await client.lang('premium.selectServer', interaction.user.id)}`, components: [row] });
            const collector = message.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 120000,
            });
            collector.on("collect", async (i) => {
                if (i.customId === "common-servers") {
                    i.deferUpdate();
                    const guild = i.values[0];
                    const selectedGuildName = client.guilds.cache.get(guild);
                    const premium = await client.db.get(`premium_${selectedGuildName.id}`)

                    if (premium?.etat === true) return interaction.editReply({ content: `<:no:1107240009746096138> **${selectedGuildName}** ${await client.lang('premium.alreadyPremium', interaction.user.id)}`, components: [] })

                    interaction.editReply({ content: `<:search:1107239974341971999> ${await client.lang('premium.add', interaction.user.id)}**${selectedGuildName}** (ID: ${selectedGuildName.id})`, components: [] })
                    await client.db.set(`premium_${selectedGuildName.id}`, { etat: true, user: interaction.user.id, id: selectedGuildName.id })


                }
            });
        } else if (cmd === "retirer") {
            const allRecords = await client.db.all("premium_");

            const premiumServers = allRecords.filter((record) => {
                return record.value && record.value.etat && record.value.user === interaction.user.id;
            });

            if (premiumServers.length === 0) {
                interaction.reply(await client.lang('premium.notServer', interaction.user.id));
                return;
            }
            const options = premiumServers.map((value, key) => {
                const guildName = client.guilds.cache.get(value.value.id);

                return {
                    label: guildName.name,
                    value: value.value.id,
                };

            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('common-servers')
                        .setPlaceholder('Servers')
                        .addOptions(options)
                )

            const message = await interaction.reply({ components: [row] })
            const collector = message.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 120000,
            });
            collector.on("collect", async (i) => {
                if (i.customId === "common-servers") {
                    i.deferUpdate();
                    const guild = i.values[0];
                    const selectedGuildName = client.guilds.cache.get(guild);
                    const premium = await client.db.get(`premium_${selectedGuildName.id}`)
                    if (premium?.etat === false) return interaction.editReply({ content: `<:no:1107240009746096138> **${selectedGuildName}** ${await client.lang('premium.noPremium', interaction.user.id)}`, components: [] })

                    interaction.editReply({ content: `<:search:1107239974341971999> ${await client.lang('premium.remove', interaction.user.id)} **${selectedGuildName}** (ID: ${selectedGuildName.id})`, components: [] })
                    await client.db.delete(`premium_${selectedGuildName.id}`)
                }
            });
        }
    }
}

module.exports = command