const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { ComponentType } = require('discord.js');

class command {
    constructor() {
        this.name = "language"
        this.description = "Permets de changer la langue du bot"
        this.category = "Util"

    }

    async execute(client, interaction) {
        const data = await client.db.get(`langue_${interaction.guild.id}`) || "fr"
        const langue = new StringSelectMenuBuilder()
            .setCustomId('langue')
            .setPlaceholder('Sélectionner une langue')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('English')
                    .setValue('en')
                    .setEmoji("🇬🇧"),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Français')
                    .setValue('fr')
                    .setEmoji("🇫🇷"),
                /* new StringSelectMenuOptionBuilder()
                     .setLabel('German')
                     .setValue('de')
                     .setEmoji("🇩🇪"),*/
            )
        const row = new ActionRowBuilder()
            .addComponents(langue);
        const embed = {
            description: `
Veuillez sélectionnez la langue d'affichage du bot.

            > 🇬🇧 — **English**
            > 🇫🇷 — **Français**`,
            color: client.config.clients.color,
        }
        const message = await interaction.reply({ embeds: [embed], components: [row], ephemeral: false })
        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 120000,
        });
        collector.on("collect", async (i) => {
            if (i.customId === "langue") {
                i.deferUpdate();
                const currentMenu = i.values[0];
                if (currentMenu === "fr") {
                    const embed = {
                        description: `
<:dot:1104789411176128512> **Bonjour, hello, guten morgen**.. La langue d'affichage du bot a été changer sur ${currentMenu}
                    
<:dot:1104789411176128512> Aider à traduire :
                    > Propulsez le projet en le traduisant dans votre langue ; plus d'informations sur notre [serveur Discord](https://discord.gg/invitation).`
                    }
                    interaction.editReply({ embeds: [embed] })
                    await client.db.set(`config.${interaction.user.id}`, {
                        langue: "fr"
                    })
                    /* } else if (currentMenu === "de") {
                         const embed = {
                             description: `
     <:dot:1104789411176128512> **Bonjour, hello, guten morgen**.. Die Anzeigesprache des Bots wurde auf geändert ${currentMenu}
                         
     <:dot:1104789411176128512> Aider à traduire :
                         > Propulsez le projet en le traduisant dans votre langue ; plus d'informations sur notre [serveur Discord](https://discord.gg/invitation).`
                         }
                         interaction.editReply({ embeds: [embed] })
                         await client.db.set(`config.${interaction.user.id}`, {
                             langue: "de"
                         })*/
                } else if (currentMenu === "en") {
                    const embed = {
                        description: `
<:dot:1104789411176128512> **Hello, hello, guten morgen**.. The bot's display language has been changed to ${currentMenu}
                    
<:dot:1104789411176128512> Help translate:
> Propel the project by translating it into your language; more information on our [Discord server](https://discord.gg/invitation).`
                    }
                    interaction.editReply({ embeds: [embed] })
                    await client.db.set(`config.${interaction.user.id}`, {
                        langue: "en"
                    })

                }
            }
        });
    }
}
module.exports = command