const Discord = require('discord.js')

class command {
    constructor() {
        this.name = "help"
        this.description = "Permets de voir la liste de mes commandes."
        this.category = "Util"
        this.options = [
            { name: "command", description: "Information about an command", type: 3 },
        ]
    }

    async execute(client, interaction) {
        const cmdstr = interaction.options
            .getString("command")
            ?.trim()
            ?.toLowerCase();
        if (cmdstr) {
            const command =
                client.commands.get(cmdstr) ||
                client.commands.find((cmd) => cmd.name.includes(cmdstr));
            if (!command)
                return interaction.reply({
                    content: `<:no:1107240009746096138> La commande \`${cmdstr}\` n'existe pas.`,
                });
            const embed = {
                title: `Command ${command.name}`,
                fields: [
                    { name: `Name:`, value: `> \`${command.name}\`` },
                    {
                        name: `About:`,
                        value: `> \`${command.description}\``,
                    },
                ],
                footer: { text: client.config.clients.name, iconURL: client.config.clients.logo },
                color: client.config.clients.color,
                image: {
                    url: "https://media.discordapp.net/attachments/1079783951083769892/1079786057878474772/image_2023-01-26_205852116.jpg"
                }
            };
            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const commands = interaction.client.commands;
            const commandNames = commands.map((command) => command.name);
            const selectOptions = commands.map((command) => {
                return {
                    label: command.name,
                    value: command.name,
                    description: command.description,
                    emoji: "<:slash:1107077510132412507> "
                };
            });
            const selectMenu = new Discord.StringSelectMenuBuilder()
                .setCustomId('help-menu')
                .setPlaceholder('Sélectionnez une commande')
                .addOptions(selectOptions);
            const actionRow = new Discord.ActionRowBuilder().addComponents(selectMenu);

            let fields = {
                Admin: {
                    name: `<:timer2:1107049223406485545> Administration`,
                    value: [],
                },
                Configuration: {
                    name: `<:config:1107049220629856378> Configuration`,
                    value: [],
                },
                Util: {
                    name: `<:role:1107049194528710666> Publique`,
                    value: [],
                },
            };
            client.commands.forEach((cmd) => {
                if (cmd.options?.find((o) => o.type === 1)) {
                    cmd.options
                        ?.filter((o) => o.type === 1 || o.type === 2)
                        .forEach((option) => {
                            if (option.type === 1)
                                fields[cmd.category]?.value.push(
                                    `\`${cmd.name} ${option.name}\``
                                );
                            else if (option.type === 2)
                                option.options.forEach((sub) => {
                                    fields[cmd.category]?.value.push(
                                        `\`${cmd.name} ${option.name} ${sub.name}\``
                                    );
                                });
                        });
                } else {
                    fields[cmd.category]?.value.push(
                        `\`${cmd.name}\``
                    );
                }
            });
            const fieldsArray = [];
            for (const key in fields) {
                fieldsArray.push({
                    name: fields[key].name,
                    value: fields[key].value.join(", "),
                })
            }
            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel('Invitation')
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
                        .setStyle(Discord.ButtonStyle.Link),
                    new Discord.ButtonBuilder()
                        .setLabel('Support')
                        .setURL(`https://discord.gg/invitation`)
                        .setStyle(Discord.ButtonStyle.Link))

            let embed = {
                title: `${await client.lang('help.titre', interaction.user.id)} ${client.user.username}`,
                fields: fieldsArray,
                color: client.config.clients.color,
                footer: { text: client.config.clients.name, iconURL: client.config.clients.logo },
                image: {
                    url: "https://media.discordapp.net/attachments/1033794359126147123/1105579565025329202/barreinvite.png?width=1200&height=118"
                }
            }
            const message = await interaction.reply({ embeds: [embed], components: [actionRow, row] });
            const filter = (interaction) => interaction.isSelectMenu() && interaction.customId === 'help-menu';
            const collector = message.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 120000,
            });
            collector.on('collect', async (interaction) => {
                const commandName = interaction.values[0];
                const command = commands.find((cmd) => cmd.name === commandName);

                if (!command) {
                    return interaction.reply(`La commande "${commandName}" n'existe pas.`);
                }
                const commandEmbed = {
                    title: `<:slashCommand:1107240020710002729>・${command.name}`,
                    description: `\`\`\`
Description: ${command.description}
Utilisation: Aucune\`\`\``,
                    footer: { text: client.config.clients.name, iconURL: client.config.clients.logo },
                    color: client.config.clients.color,
                    image: {
                        url: "https://media.discordapp.net/attachments/1079783951083769892/1079786057878474772/image_2023-01-26_205852116.jpg"
                    }
                };
                interaction.reply({ embeds: [commandEmbed], ephemeral: true });

            });
        }
    }
}
module.exports = command