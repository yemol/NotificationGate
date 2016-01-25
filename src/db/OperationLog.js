import mysql from "./mysql/mysqlAdapter"
import config from "./mysql/config.json"
import app from "../lib/app.js"

export default class OperationLog {
  constructor () {
    this.id = -1
    this.operation = ""
    this.clientInfo = ""
    this.clientAddress = ""
    this.timeMark = ""
  }

  showMe () {
    return  `id = ${this.id}, operation = ${this.operation}, clientInfo = ${this.clientInfo}, clientAddress = ${this.clientAddress}, timeMark = ${this.timeMark}`
  }

  fill (row, operationLog) {
    try {
      if (row !== null && row !== undefined) {
        operationLog = new OperationLog()
        operationLog.id = row.id
        operationLog.operation = row.from
        operationLog.clientInfo = row.message
        operationLog.clientAddress = row.detail
        operationLog.timeMark = row.timeMark
        app.logger.info("OperationLog.fill: " + operationLog.showMe())
      }
    } catch (e) {
      app.logger.error("OperationLog.fill: Fill data error. Error is [" + e + "] data is [" + operationLog.showMe() + "]")
    } finally {
      return operationLog
    }
  }

  addOne (operationLog, done) {
    mysql.insert("operation_log",
                [ "Operation", "ClientInfo", "CleintAddress" ],
                [ operationLog.operation, operationLog.clientInfo, operationLog.clientAddress ])
    .then( value => {
      return done(null, mysql.getInsertedID(value))
    })
    .catch ( error => {
      return done(error, null)
    })
  }

}
