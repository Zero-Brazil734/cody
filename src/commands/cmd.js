const Command = require("../utils/command")
const Discord = require("discord.js")
const dotenv = require("dotenv")
const fs = require("fs")
const moment = require("moment-timezone")
const os = require("os")
const util = require("util")
const child = require("child_process")
const Utils = require("../utils/index")

class Eval extends Command {
    constructor(client) {
        super(client)

        this.name = "cmd"
        this.aliases = ["eval", "compile", "script", "exec"]
        this.category = "개발"
        this.description = "JavaScript 코드를 실행합니다."
        this.usage = "cmd [code]"

        this.allowDM = true
        this.perm = "devonly"

        this.dir = __filename
    }

    async run(message, args) {
        let client = this.client
        let msg = message
        let cmd = args.join(" ")
        let type

        new Promise(resolve => resolve(eval(cmd)))
            .then(async res => {
                let code = type = res

                if (typeof code !== "string") code = util.inspect(code, { depth: 0 })
                if (typeof type === "function") code = code.toString()

                let evalEmbed = new this.embed()
                    .setAuthor("Eval", message.author.avatarURL)
                    .setColor(this.client.color)
                    .addField("⌨Input:", `\`\`\`js\n${String(cmd).length > 983 ? this.clean(String(cmd).substring(0, 983) + "\n//And much more...") : this.clean(cmd)}\n\`\`\``)
                    .addField("💻Output:", `\`\`\`js\n${String(code).length > 983 ? this.clean(String(code).substring(0, 983) + "\n//And much more...") : this.clean(code)}\n\`\`\``)
                message.channel.send(evalEmbed)
            }).catch(Ecmd => {
                let Eembed = new this.embed()
                    .setTitle("Eval Error:")
                    .setColor(this.client.color)
                    .setDescription(`\`\`\`${String(Ecmd).length > 983 ? this.clean(String(Ecmd).substring(0, 983) + "\n//And much more...") : this.clean(Ecmd)}\`\`\``)
                message.channel.send(Eembed)
            })
    }

    clean(text) {                                                //String.fromCharCode(8203) = 공백 문자
        return typeof text === "string" ? text.replace(/`/gi, "`" + String.fromCharCode(8203)).replace(/@/gi, "@" + String.fromCharCode(8203)) : text
    }
}

module.exports = Eval