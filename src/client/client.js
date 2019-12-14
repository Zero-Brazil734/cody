const { Client, Collection } = require("discord.js")
const Logger = require("../utils/logger")
const Utils = require("../utils/index")
const requireAll = require("require-all")
const fs = require("fs")

class Cody extends Client {
    /**
     * @param {object} options - 클라이언트 생성의 옵션 
     */
    constructor(options) {
        super(options)

        /**
         * @param dev - 이 봇의 개발자 지정
         */
        this.dev = this.options.dev
        /**
         * @param color - 자신이 원하는 색 지정(임베드에 사용)
         */
        this.color = "RANDOM"

        if (process.env.TOKEN !== undefined) {
            this.login(process.env.TOKEN).catch(err => this.logger.error(`클라이언트 로그인에 실패 했습니다. 사유: ${err}`))
        } else {
            this.loadConfigs(require.resolve("../configs/.env"))
                .then(() => this.login(process.env.TOKEN)
                    .catch(err => this.logger.error(`클라이언트 로그인에 실패 했습니다. 사유: ${err}`)))
        }

        /**
         * @param commands - 명령어들을 저장할 컬렉션
         */
        this.commands = new Collection()
        /**
         * @param aliases - 단축키들을 저장할 컬렉션
         */
        this.aliases = new Collection()

        /**
         * @param logger - 각종 내용들을 기록해주는 로거 
         */
        this.logger = new Logger(this)
    }

    /**
     * @function loadConfigs - 설정을 로딩하는 메소드
     * @param {string} dir - .env 파일의 경로 
     * @returns undefined
     */
    async loadConfigs(dir) {
        if (fs.existsSync(dir) !== true) this.logger.error(".env 파일의 경로가 정확하지 않습니다.")

        await Utils.loadConfigs({ path: dir })
    }

    /**
     * @function loadCommands - 명령어들을 저장하는 메소드
     * @param {string} dir - 명령어 폴더의 경로 
     * @returns undefined
     */
    async loadCommands(dir) {
        requireAll({
            dirname: dir,
            filter: /\.js$/,
            resolve: Command => {
                let cmd = new Command(this)

                for (let alias of cmd.aliases) {
                    if (this.aliases.has(alias)) this.logger.error(`해당 단축키 "${alias}"는(은) 이미 존재합니다.`)
                    this.aliases.set(alias, cmd)
                    this.logger.info(`"${alias}" 단축키가 성공적으로 저장 되었습니다.`)
                }

                if (this.commands.has(cmd.name)) this.logger.error(`해당 명령어 "${cmd.name}"는(은) 이미 존재합니다.`)

                this.logger.info(`"${cmd.name}" 명령어가 성공적으로 저장 되었습니다.`)
                return this.commands.set(cmd.name, cmd)
            }
        })
    }

    /**
     * @function loadCommand - 명령어를 저장하는 메소드
     * @param {string} dir - 명령어 파일의 경로
     * @returns Boolean
     */
    async loadCommand(dir) {
        let cmd = new (require(dir))(this)

        for (let alias of cmd.aliases) {
            this.aliases.set(alias, cmd)
            this.logger.info(`"${alias}" 단축키가 성공적으로 저장 되었습니다.`)
        }

        this.logger.info(`"${cmd.name}" 명령어가 성공적으로 저장 되었습니다.`)
        this.commands.set(cmd.name, cmd)

        return true
    }

    /**
     * @function loadEvents - 이벤트를 로딩하는 메소드
     * @param {string} dir - 이벤트 폴더의 경로 
     * @returns undefined
     */
    async loadEvents(dir) {
        requireAll({
            dirname: dir,
            filter: /\.js$/gi,
            resolve: Event => {
                let event = new Event(this)
                this.on(event.eventName, (...args) => event.run(...args))
                this.logger.info(`"${event.eventName}" 이벤트가 성공적으로 로딩 되었습니다.`)
            }
        })
    }

    /**
     * @function reloadAllCommands - 모든 명령어를 다시 로딩하는 메소드
     * @returns undefined
     */
    async reloadAllCommands() {
        this.aliases.deleteAll()

        this.commands.forEach(c => {
            delete require.cache[c.dir]

            this.loadCommand(c.dir)
        })
    }

    /**
     * @function reloadCommand - 명령어를 다시 로딩하는 메소드
     * @param {string} query - 리로드할 명령어의 이름, 단축키 또는 파일 경로
     * @param {object} options - 리로드 옵션
     * @param {boolean} options.queryByDir - query의 항목을 파일 경로로써 인식합니다.
     * @returns Boolean
     */
    async reloadCommand(query, options = { queryByDir: false }) {
        if (options.queryByDir === true) {
            if (fs.existsSync(query) === false) this.logger.error("해당 경로는 존재하지 않습니다.")

            delete require.cache[query]

            let cmd = new (require(query))(this)
            for (let alias of cmd.aliases) {
                this.aliases.delete(alias)
            }
            this.commands.delete(cmd.name)

            this.loadCommand(query)

            return true
        } else {
            if (!this.commands.has(query) && !this.aliases.has(query)) this.logger.error("해당 명령어는 존재하지 않습니다.")

            let cc = {
                cmd: this.commands.get(query),
                alias: this.aliases.get(query)
            }

            if (cc.cmd) {
                let dir = cc.cmd.dir
                delete require.cache[dir]

                for (let alias of cc.cmd.aliases) {
                    this.aliases.delete(alias)
                }
                this.commands.delete(query)

                this.loadCommand(dir)

                return true
            } else if (cc.alias) {
                let dir = cc.alias.dir
                delete require.cache[dir]

                for (let alias of cc.alias.aliases) {
                    this.aliases.delete(alias)
                }
                this.commands.delete(cc.alias.name)

                this.loadCommand(dir)

                return true
            }
        }
    }

    /**
     * @function runCommand - 명령어를 돌려주는 메소드
     * @param {string} command - 명령어
     * @param {object} message - 메세지 오브젝트(객체)
     * @param {string[]} args - 명령어를 제외한 메세지의 내용이 Array로 정리된것(이하 args) (예시: <msg>.content.slice(<접두사>.length).trim().split(/ +/g) )
     * @returns Boolean
     */
    async runCommand(command, message, args) {
        if (typeof command !== "string") this.logger.error("명령어는 문자열이여야 합니다. 전달 받은 command의 타입: " + typeof command)
        if (typeof message !== "object") this.logger.error("메세지 오브젝트(객체)는 말 그대로 객체이여야 합니다. 전달 받은 message의 타입: " + typeof message)
        if (!Array.isArray(args)) this.logger.error("args는 Array이여야 합니다. 전달 받은 args의 타입: " + typeof args)

        if (Array.isArray(this.dev)) {
            var filterDev = this.dev.includes(message.author.id)
        } else if (typeof this.dev === "string") {
            var filterDev = message.author.id === this.dev
        } else {
            this.logger.error("Client#dev 옵션은 타입으로써 String 또는 Array만 지원합니다.")
        }

        if (this.commands.get(command)) {
            let cmd = this.commands.get(command)

            if (cmd.allowDM !== true && message.channel.type === "dm") return
            if ((cmd.perms ? cmd.perms.includes("devonly") : false) === false && !filterDev && (cmd.allowUsers ? cmd.allowUsers.includes(message.author.id) : false) === false) return message.channel.send(`${message.author} 님은 해당 명령어를 실행할 권한이 없습니다.`)
            if ((cmd.perms ? cmd.perms.includes("admin") : false) === false && !filterDev && (message.member ? message.member.hasPermission("ADMINISTRATOR") : false) === false) return message.channel.send(`${message.author} 님은 해당 명령어를 실행할 권한이 없습니다.`)

            cmd.run(message, args)

            return true
        }

        if (this.aliases.get(command)) {
            let cmd = this.aliases.get(command)

            if (cmd.allowDM !== true && message.channel.type === "dm") return
            if ((cmd.perms ? cmd.perms.includes("devonly") : false) === false && !filterDev && (cmd.allowUsers ? cmd.allowUsers.includes(message.author.id) : false) === false) return message.channel.send(`${message.author} 님은 해당 명령어를 실행할 권한이 없습니다.`)
            if ((cmd.perms ? cmd.perms.includes("admin") : false) === false && !filterDev && (message.member ? message.member.hasPermission("ADMINISTRATOR") : false) === false) return message.channel.send(`${message.author} 님은 해당 명령어를 실행할 권한이 없습니다.`)

            cmd.run(message, args)

            return true
        }
    }
}

/** @exports Cody */
module.exports = Cody