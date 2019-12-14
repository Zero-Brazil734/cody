const Event = require("../utils/event")

class Error extends Event {
    constructor(client) {
        super(client)

        this.eventName = "error"

        this.dir = __filename
    }

    run(error) {
        return this.client.logger.alert(`DiscordJS Error: ${error.stack || error}`)
    }
}

module.exports = Error