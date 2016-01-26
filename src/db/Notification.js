import mysql from "./mysql/mysqlAdapter"
import config from "./mysql/config.json"
import app from "../lib/app.js"

export default class Notification {
  constructor () {
    this.id = -1
    this.from = ""
    this.message = ""
    this.detail = ""
    this.timeMark = ""
  }

  showMe () {
    return  `id = ${this.id}, from = ${this.from}, message = ${this.message}, detail = ${this.detail}, timeMark = ${this.timeMark}`
  }

  fill (row, notification) {
    try {
      if (row !== null && row !== undefined) {
        notification = new Notification()
        notification.id = row.id
        notification.from = row.from
        notification.message = row.message
        notification.detail = row.detail
        notification.timeMark = row.timeMark
        app.logger.info("Notification.fill: " + notification.showMe())
      }
    } catch (e) {
      app.logger.error("Notification.fill: Fill data error. Error is [" + e + "] data is [" + operationLog.showMe() + "]")
    } finally {
      return notification
    }
  }

  addOne (notification, done) {
    mysql.insert("notification",
                [ "from", "message", "detail" ],
                [ notification.from, notification.message, notification.detail ])
    .then( value => {
      return done(null, mysql.getInsertedID(value))
    })
    .catch ( error => {
      return done(error, null)
    })
  }

}
