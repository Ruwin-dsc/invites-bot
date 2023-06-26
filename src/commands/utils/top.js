const { EmbedBuilder } = require('discord.js');
class command {
    constructor() {
        this.name = "top"
        this.description = "Permets de voir le leaderboard des invitations."
        this.category = "Util"
    }

    async execute(client, interaction) {

        const top = []

        interaction.guild.members.cache.map(async member => {
            const data = await client.db.get(`invites_${interaction.guild.id}_${member.user.id}`)
            top.push({ member: member.user.username, invites: data ? data.total : 0 })
        })
        const lb = top.sort((a, b) => b.invites - a.inv)
        setTimeout(() => {
            const embed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name}`)
                .setDescription(`${lb.map(function (data, index) { return `${index + 1}. **\`${data.member}\`** • **${data.invites}** invites` }).splice(0, 15).join('\n')}`)
            return interaction.reply({ embeds: [embed] })
        }, 500)
    }
}

module.exports = command