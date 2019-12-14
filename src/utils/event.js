/**
 * @class Event
 * @description - 이벤트 코드 템플릿
 * @template
 */
class Event {
    /**
     * @param {object} client - Discord.Client
     */
    constructor(client) {
        /**
         * @param {object} client - Discord.Client
         */
        this.client = client
        
        /**
         * @param {string} eventName - 이벤트의 이름
         */
        this.eventName = ""

        /**
         * @param {string|null} dir - 이벤트 파일의 경로
         */
        this.dir = null
    }

    /**
     * @function run - 이벤트가 emit될시 실행할 코드
     * @param  {...any} args - 전달받는 이벤트 데이터
     */
    run(...args) {

    }
}

module.exports = Event