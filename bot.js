/**
 * @author Zero-Brazil734
 * @memberof StayCute™
 * @name cody
 * @description 이 레포지토리는 ECMAScript 6에 추가된 class라는 유사 객체 및 관련 객체를 정의하는 주요 방법을 중점적으로 쓰여진 디스코드 봇 오픈소스입니다.
 * @license Apache-2.0
 * @copyright Copyright (c) 2019 StayCute™
 * @see https://github.com/Zero-Brazil734/cody/blob/master/README.md
 */


const Client = require("./src/client/client")
const client = new Client({ 
    disableEveryone: true,
    dev: "462355431071809537" //주의: dev는 discord.js의 Client 옵션이 아닙니다. 지원하는 타입: String / Array
})

client.logger.global("---------------[ Commands Loading... ]---------------")
client.loadCommands(`${__dirname}/src/commands/`) //명령어 로드
client.logger.global("---------------[ Event Loading... ]---------------")
client.loadEvents(`${__dirname}/src/events/`) //이벤트 로드

process.on("uncaughtException", error => console.error(error.stack || error)) 
process.on("unhandledRejection", (reason, promise) => console.error(reason))