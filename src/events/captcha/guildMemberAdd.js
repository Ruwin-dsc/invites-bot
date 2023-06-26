const { Events } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client, member) {
        console.log('\x1b[31m' + `Le serveur ` + '\x1b[35m' + `${member.guild.name}` + '\x1b[31m' + ' vient d\'avoir un nouveau membre ' + '\x1b[35m' + `${member.user.tag}`)

        function generateCaptcha() {
            let text = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
        const config = await client.db.get(`captcha_${member.guild.id}`) || { roles: undefined, toggle: undefined, channel: undefined }
        if (!config.toggle) return;
        const channel = member.guild.channels.cache.get(config.channel);
        if (!channel) return;
        if (member.user.bot) return;
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage("https://media.discordapp.net/attachments/1107048743892688927/1107069508612542524/image_2023-05-14_0017051132.jpg", { format: "jpg" });
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        let captchaText = generateCaptcha();
        ctx.textAlign = "center";
        ctx.font = "100px sans-serif";
        ctx.fillStyle = "#ffffff";

        ctx.fillText(captchaText, canvas.width / 2, canvas.height / 2 + 20)
        let fake1 = generateCaptcha();
        let fake2 = generateCaptcha();
        let buttons = [
            { type: 2, style: 1, label: fake1, custom_id: fake1 },
            { type: 2, style: 1, label: fake2, custom_id: fake2 },
            { type: 2, style: 1, label: captchaText, custom_id: captchaText }
        ]
        buttons = buttons.sort(() => Math.random() - 0.5);
        const message = await channel.send({
            content: `${member.user}`,
            components: [{
                type: 1,
                components: buttons
            }], files: [{ attachment: canvas.toBuffer(), name: "captcha.jpg" }]
        })
        const collector = message.createMessageComponentCollector({ filter: (i) => i.user.id === member.id, time: 300000, max: 1 });
        collector.on("collect", async (collected) => {
            if (collected.customId === captchaText) {
                collected.deferUpdate();
                message.delete();
                member.roles.add(config.roles);
            } else {
                collected.deferUpdate();
                message.delete();
                member.kick();
            }
        });
    }
}