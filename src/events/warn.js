const Event = require("../utils/event")

class Warn extends Event {
    constructor(client) {
        super(client)

        this.eventName = "warn"

        this.dir = __filename
    }

    run(info) {
        return this.client.logger.warn(`DiscordJS Warning: ${info}`)
    }
}

module.exports = Warn