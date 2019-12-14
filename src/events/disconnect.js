const Event = require("../utils/event")

class Disconnect extends Event {
    constructor(client) {
        super(client)

        this.eventName = "disconnect"

        this.dir = __filename
    }

    run(event) {
        let improviseLogger = new (require("../utils/logger"))(this.client)
        
        improviseLogger.alert(`봇의 웹소켓 연결이 끊어졌습니다.\n----------------[관련 정보]----------------\n타입: ${event.type}\n사유: ${event.reason === "" ? "없음" : event.reason}\n코드: ${event.code}\n----------------[관련 정보]----------------`)
        improviseLogger.warn("강제로 웹소켓 재접속 중입니다...")
        this.client.login(process.env.TOKEN)
            .then(async () => {
                improviseLogger.alert("재접속이 성공적으로 이루어진듯 하여 명령어 및 이벤트를 리로드합니다...")
                await this.client.removeAllListeners()
                await this.client.commands.deleteAll()
                await this.client.aliases.deleteAll()

                this.client.loadEvents(__dirname)
                this.client.loadCommands(__dirname.replace("events", "commands"))
                    .catch(erro => {
                        if (erro.toString().includes("는(은) 이미 존재합니다.")) return
                    })

                improviseLogger.global("모든 이벤트와 명령어들이 리로드 되었습니다.")
            })
            .catch(err => improviseLogger.error(`해당 오류에 의하여 재접속에 실패 했습니다: ${err}`))
    }
}

module.exports = Disconnect