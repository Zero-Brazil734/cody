const Command = require("../utils/command")

class Ping extends Command {
    constructor(client) {
        super(client)

        this.name = "핑"
        this.aliases = ["pong", "pn", "p", "퐁", "ping", "ㅍ"]
        this.category = "유틸리티"
        this.description = "봇의 반응 속도를 확인합니다."
        this.usage = "핑"

        this.allowDM = true

        this.dir = __filename
    }

    async run(message, args) {
        let msg = await message.channel.send("Calculating...")

        let embed = new this.embed()
            .setTitle(`${this.client.user.username}의 현재 반응 속도:`)
            .setColor("RANDOM")
            .addField("📡WebSocket:", `\`\`${this.client.pings.join("ms, ")}ms\`\``)
            .addField("💬메시지:", `\`\`${msg.createdTimestamp - message.createdTimestamp}ms\`\``)
        return msg.edit(embed)
    }
}

module.exports = Ping