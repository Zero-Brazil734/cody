const { RichEmbed } = require("discord.js")

/**
 * @class Command
 * @description - 명령어 코드 템플릿
 * @template
 */
class Command {
    /**
     * @param {object} client - Discord.Client
     */
    constructor(client) {
        /**
         * @param {object} client - Discord.Client
         */
        this.client = client

        /**
         * @param {string} name - 명령어의 이름
         */
        this.name = ""
        /**
         * @param {string[]} aliases - 명령어의 단축키 목록
         */
        this.aliases = []
        /**
         * @param {string} category - 명령어의 종류
         */
        this.category = "기타"
        /**
         * @param {string|undefined} description - 명령어의 설명
         */
        this.description = undefined
        /**
         * @param {string|undefined} usage - 명령어의 사용법
         */
        this.usage = undefined

        /**
         * @param {boolean} allowDM - DM에서 명령어 사용 허용
         */
        this.allowDM = false
        /**
         * @param {string[]} allowUsers - 권한이 부족해도 사용을 허가할 유저 목록
         */
        this.allowUsers = []
        /**
         * @param {string[]} perms - 명령어의 권한 설정 목록
         */
        this.perms = []

        /**
         * @param {string|null} dir - 명령어의 파일 경로
         */
        this.dir = null

        /**
         * @param {*} embed - Discord.Embed 첨부
         */
        this.embed = RichEmbed
    }

    /**
     * @function run - 명령어를 실행하는 메소드
     * @param {object} message - Client#message event
     * @param {string[]} args - 아거먼트 
     */
    async run(message, args) {}
}

/** @exports Command */
module.exports = Command