const Event = require("../utils/event")

class Debug extends Event {
    constructor(client) {
        super(client)

        this.eventName = "debug"

        this.dir = __filename
    }

    run(info) {
        if(!info.startsWith("[ws]")) return

        this.client.logger.debug(info)
    }
}

module.exports = Debug