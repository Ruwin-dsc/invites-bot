const { AttachmentBuilder } = require('discord.js');
const Canvas = require("canvas");

class command {
    constructor() {
        this.name = "test"
        this.description = "Permets de voir le ping du bot."
        this.category = "Util"
        this.premium = true
    }

    async execute(client, interaction) {

        const canvas = Canvas.createCanvas(1772, 633);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(`https://media.discordapp.net/attachments/1108344216427429908/1108784564563886110/image_2023-05-18_1511130352-modified.png`);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#f2f2f2';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        var textString2 = `${interaction.user.tag}`;
        ctx.font = 'bold 105px Genta';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(textString2, 820, 500);

        ctx.beginPath();
        ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));
        ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
        const attachment = new AttachmentBuilder(canvas.toBuffer(), 'welcome-image.png');
        interaction.reply({ files: [attachment] })
    }
}
module.exports = command    