const Command = require("../utils/command")

class Help extends Command {
    constructor(client) {
        super(client)

        this.name = "도움말"
        this.aliases = ["?", "도움", "help", "h", "ㄷㅇ", "ㄷㅇㅁ"]
        this.category = "유틸리티"
        this.description = "봇의 명령어 목록을 확인 및 자세한 정보를 알수 있습니다."
        this.usage = "도움말 [cmd]"

        this.allowDM = true

        this.dir = __filename
    }

    run(message, args) {
        let query = args[0]
        if (!query) {
            let utilityList = `\`\`${this.client.commands.filter(f => f.category === "유틸리티").keyArray().join("``, ``")}\`\``
            let infoList = `\`\`${this.client.commands.filter(f => f.category === "정보").keyArray().join("``, ``")}\`\``
            let othersList = `\`\`${this.client.commands.filter(f => f.category === "기타").keyArray().join("``, ``")}\`\``
            let adminsList = `\`\`${this.client.commands.filter(f => f.category === "관리").keyArray().join("``, ``")}\`\``
            let developersList = `\`\`${this.client.commands.filter(f => f.category === "개발").keyArray().join("``, ``")}\`\``
            let databaseList = `\`\`${this.client.commands.filter(f => f.category === "데이터베이스").keyArray().join("``, ``")}\`\``

            if (Array.isArray(this.client.dev)) {
                var filterDev = this.client.dev.includes(message.author.id)
                var mention = `<@${filterDev.join(">, <@")}>`
            } else if (typeof this.client.dev === "string") {
                var filterDev = message.author.id === this.client.dev
                var mention = `<@${this.client.dev}>`
            }

            let baseEmbed = new this.embed()
                .setTitle(`${this.client.user.username}의 명령어 리스트:`)
                .setColor(this.client.color)
                .setDescription(`각종 명령어의 자세한 정보를 보기 원하신다면 \`\`+도움말 <명령어>\`\`를 입력 해주세요.\n\n**🐛 | \`\`버그를 발견 하셨나요?\`\` ${mention} \`\`에게 전달 해주세요!\`\`\n🤝 | \`\`새로운 의견이 있으신가요?\`\` ${mention} \`\`에게 전달 해주세요!\`\`**\n\n${message.author.presence.clientStatus["desktop"] && !message.author.presence.clientStatus["mobile"] ? `———————————[${this.client.user.tag}]———————————` : `—————[${this.client.user.tag}]—————`}`)
                .setFooter(this.client.user.username, this.client.user.avatarURL)
                .setTimestamp()
                .addField("🔧 | 유틸리티:", utilityList)
                .addField("ℹ | 정보:", infoList)
                .addField("🗂️ | 데이터베이스:", databaseList)
                .addField("🔍 | 기타:", othersList)

            if (message.member.hasPermission("ADMINISTRATOR")) baseEmbed.addField("🛠️ | 관리자:", adminsList)
            if (filterDev) baseEmbed.addField("🖥️ | 개발자: ", developersList)

            return message.channel.send(baseEmbed)
        } else {
            if (!this.client.commands.has(query) && !this.client.aliases.has(query)) {
                let embed = new this.embed()
                    .setColor(this.client.color)
                    .setTimestamp()
                    .setFooter(message.author.username, message.author.avatarURL)
                    .setDescription(`**해당 명령어(\`${query}\`)는 명령어 목록에 존재하지 않습니다. 모든 명령어 리스트를 불러올까요?**`)
                return message.channel.send(embed).then(msg => {
                    msg.react("✅")

                    let filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id
                    let coll = msg.createReactionCollector(filter, { time: 60000 })
                    coll.on("collect", () => { args.pop(); this.run(this.client, message, args); msg.delete() })
                })
            }

            let embed = new this.embed()
                .setColor(this.client.color)
                .setTimestamp()
                .setFooter(message.author.username, message.author.avatarURL)

            if (this.client.commands.get(query)) {
                embed
                    .setTitle(`${this.client.user.username}의 ${query} 명령어 도움말:`)
                    .addField("⌨️명령어:", query, true)
                    .addField("🏷️카테고리:", this.client.commands.get(query).category, true)
                    .addField("📑사용법:", `\`\`${this.client.commands.get(query).usage}\`\``, true)
                    .addField("🗒️단축키 목록:", `\`\`${this.client.commands.get(query).aliases.join("``, ``")}\`\``)
                    .addField("📋설명:", `\`\`\`fix\n${this.client.commands.get(query).description}\n\`\`\``)
            } else if (this.client.aliases.get(query)) {
                embed
                    .setTitle(`${this.client.user.username}의 ${this.client.aliases.get(query).name} 명령어 도움말:`)
                    .addField("⌨️명령어:", this.client.aliases.get(query).name, true)
                    .addField("🏷️카테고리:", this.client.aliases.get(query).category, true)
                    .addField("📑사용법:", `\`\`${this.client.aliases.get(query).usage}\`\``, true)
                    .addField("🗒️단축키 목록:", `\`\`${this.client.aliases.get(query).aliases.join("``, ``")}\`\``)
                    .addField("📋설명:", `\`\`\`fix\n${this.client.aliases.get(query).description}\n\`\`\``)
            }

            return message.channel.send(embed)
        }
    }
}

module.exports = Help