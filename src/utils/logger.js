const chalk = require("chalk")
const moment = require("moment-timezone")
moment.locale("ko-KR")

/**
 * @class Logger
 * @description - 각종 내용들을 기록해주는 로거
 */
class Logger {
    constructor(client) {
        this.client = client

        this.logs = []
        this.logs.push({ type: "initial", text: undefined, timestamp: Date.now() })

        this.plugin(`${Logger.name} 플러그인 로딩 완료.`)
        this.logs.push({
            type: "plugin",
            text: `${Logger.name} 플러그인 로딩 완료.`,
            timestamp: Date.now()
        })
    }

    alert(...args) {
        let now = Date.now()

        console.log(chalk.bgBlack(chalk.bold(chalk.red(`[${moment(now).tz(process.env.TIMEZONE).format("MM월 DD일 - HH:mm:ss")}] [${this.parse(this.logs[this.logs.length - 1].timestamp, now)}] [ALERT] ${args}`))))
        this.logs.push({
            type: "alert",
            text: args,
            timestamp: now
        })

        return this
    }

    info(...args) {
        let now = Date.now()

        console.log(chalk.cyan(`[${moment(now).tz(process.env.TIMEZONE).format("MM월 DD일 - HH:mm:ss")}] [${this.parse(this.logs[this.logs.length - 1].timestamp, now)}] [INFO] ${args}`))
        this.logs.push({
            type: "info",
            text: args,
            timestamp: now
        })

        return this
    }

    warn(...args) {
        let now = Date.now()

        console.log(chalk.yellow(`[${moment(now).tz(process.env.TIMEZONE).format("MM월 DD일 - HH:mm:ss")}] [${this.parse(this.logs[this.logs.length - 1].timestamp, now)}] [WARN] ${args}`))
        this.logs.push({
            type: "warn",
            text: args,
            timestamp: now
        })

        return this
    }

    error(err) {
        let now = Date.now()

        this.logs.push({
            type: "error",
            text: err,
            timestamp: now
        })
        throw new Error(chalk.bold(chalk.bgBlack(chalk.red(err.stack || err))))
    }

    debug(...args) {
        let now = Date.now()

        console.log(chalk.bgBlack(chalk.blue(`[${moment(now).tz(process.env.TIMEZONE).format("MM월 DD일 - HH:mm:ss")}] [${this.parse(this.logs[this.logs.length - 1].timestamp, now)}] [DEBUG] ${args}`)))
        this.logs.push({
            type: "debug",
            text: args,
            timestamp: now
        })

        return this
    }

    global(...args) {
        let now = Date.now()

        console.log(chalk.bold(chalk.white(`[${moment(now).tz(process.env.TIMEZONE).format("MM월 DD일 - HH:mm:ss")}] [${this.parse(this.logs[this.logs.length - 1].timestamp, now)}] [GLOBAL] ${args}`)))
        this.logs.push({
            type: "global",
            text: args,
            timestamp: now
        })

        return this
    }

    rest(...args) {
        let now = Date.now()

        console.log(chalk.bgBlack(chalk.bold(chalk.green(`[${moment(now).tz(process.env.TIMEZONE).format("MM월 DD일 - HH:mm:ss")}] [${this.parse(this.logs[this.logs.length - 1].timestamp, now)}] [REST] ${args}`))))
        this.logs.push({
            type: "rest",
            text: args,
            timestamp: now
        })

        return this
    }

    plugin(...args) {
        let now = Date.now()

        console.log(chalk.bgBlack(chalk.bold(chalk.yellow(`[${moment(now).tz(process.env.TIMEZONE).format("MM월 DD일 - HH:mm:ss")}] [${this.parse(this.logs[this.logs.length - 1].timestamp, now)}] [PLUGIN] ${args}`))))
        this.logs.push({
            type: "plugin",
            text: args,
            timestamp: now
        })

        return this
    }

    clearLogHistory(count = 0) {
        if (count === 0) {
            this.logs = []
            try {
                require("child_process").execSync(process.platform === "win32" ? "cls" : "clear")
            } catch (e) { return }
        } else {
            for(let i = 0; i < count; i++) {
                this.logs.delete(this.logs.keyArray().reverse()[i])
            }
        }

        return this.logs
    }

    parse(lastTimestamp, newTimestamp) {
        let time = newTimestamp - lastTimestamp

        if(time >= 1000) {
            time /= 1000
            var result = `${time.toFixed(2)}s`

            let tester = result
            if(tester.replace("s", "").endsWith(".00")) result = `${time}s`

            if(time >= 60) {
                time /= 60
                var result = `${time.toFixed(2)}m`

                let tester = result
                if (tester.replace("m", "").endsWith(".00")) result = `${time}m`

                if(time >= 60) {
                    time /= 60
                    var result = `${time.toFixed(2)}h`

                    let tester = result
                    if (tester.replace("h", "").endsWith(".00")) result = `${time}h`

                    if(time >= 24) {
                        time /= 24 
                        var result = `${time.toFixed(2)}d`

                        let tester = result
                        if (tester.replace("d", "").endsWith(".00")) result = `${time}d`
                    }
                }
            }
        } else {
            var result = `${time.toFixed(2)}ms`

            let tester = result
            if (tester.replace("ms", "").endsWith(".00")) result = `${time}ms`
        }

        return result
    }
}

/**
 * @exports Logger
 */
module.exports = Logger