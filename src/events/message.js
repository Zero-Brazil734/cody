const Event = require("../utils/event")

class Message extends Event {
    constructor(client) {
        super(client)

        this.eventName = "message"

        this.dir = __filename
    }

    async run(message) {
        if(message.author.bot || message.system || !message.content.startsWith(process.env.PREFIX)) return
        
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()

        this.client.runCommand(command, message, args)
    }
}

module.exports = Message