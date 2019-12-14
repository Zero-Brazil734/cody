
/**
 * @class Utils
 * @description - 각종 유틸리티를 모아둔 클래스
 */
class Utils {
    /**
     * @function loadConfigs - 토큰, 타임존, 접두사 같은 설정들을 .env에서 불러옵니다.
     * @param {object} options - dotenv config 옵션 
     * @static
     * @returns undefined
     */
    static async loadConfigs(options) {
        new Promise(resolve => resolve(require("dotenv").config(options)))
            .then(() => {
                if (process.env.TOKEN === undefined || process.env.TIMEZONE === undefined) throw new Error("무언가가 잘못 되어 설정 로딩에 실패 하였습니다...")
            })
            .catch(err => { throw new Error(err) })
    }

    /**
     * @function clean - 디스코드의 마크다운 문법을 제거해주는 메소드
     * @param {string} text - 디스코드의 마크다운 문법을 제거할 텍스트
     * @static 
     * @returns String
     */
    static clean(text) {                                                //String.fromCharCode(8203) = 공백 문자
        return typeof text === "string" ? text.replace(/`/gi, "`" + String.fromCharCode(8203)).replace(/@/gi, "@" + String.fromCharCode(8203)) : text
    }
}

module.exports = Utils