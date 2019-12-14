const Event = require("../utils/event")

class Ready extends Event {
    constructor(client) {
        super(client) 
        
        this.eventName = "ready"

        this.dir = __filename
    }

    run() {
        this.client.logger.rest(`클라이언트 ${this.client.user.tag}로 로그인 되었습니다.`)

        let st = [
            {
                name: "© 2019 StayCute™", type: "WATCHING"
            },
            {
                name: `${this.client.user.tag} | ${this.client.users.size} 유저`, type: "LISTENING"
            },
            {
                name: `${this.client.user.tag} | ${this.client.guilds.size} 서버`, type: "PLAYING"
            },
            {
                name: `${this.client.user.tag} | ${this.client.commands.size} 명령어`, type: "STREAMING", url: "https://twitch.tv/undefined"
            }
        ]

        let changePresence = () => {
            let status = st[Math.floor(Math.random() * st.length)]
            return this.client.user.setPresence({ game: status })
        }

        changePresence()
        setInterval(() => changePresence(), 6500)
    }
}

module.exports = Ready