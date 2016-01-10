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
        notification.id = row.id
        notification.from = row.from
        notification.message = row.message
        notification.detail = row.detail
        notification.timeMark = row.timeMark
        app.logger.info("Notification.fill: " + notification.showMe())
      }
    } catch (e) {
      app.logger.error("Notification.fill: Fill data error. Error is [" + e + "] data is [" + this.showMe() + "]")
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

  // static getOne (done, notification) {
  //   try {
  //     connection = mysql.connect()
  //     if (connection !== null) {
  //       connection.query("\
  //         SELECT * FROM `" + config.databaseName + "`.`Notification` WHERE `id` = ?", [ notification.id ],
  //         (err, result) => {
  //           if (err != null) {
  //             return done(err, null)
  //           } else if (result === null || result.length === 0) {
  //             return done("No Notification found", null)
  //           } else {
  //             return done(null, notification.fill(result[0]))
  //           }
  //         })
  //     }
  //   } catch (e) {
  //     app.logger.error("Notification.get: Get data error. Error is [" + e + "] data is [" + this.showMe() + "]")
  //     return done("Get data error. ", null)
  //   }
  //   finally {
  //     mysql.end()
  //   }
  // }

  // static getAfter (done, notification) {
  //   try {
  //     connection = mysql.connect()
  //     if (connection !== null) {
  //       connection.query("\
  //         SELECT * FROM `" + config.databaseName + "`.`Notification` WHERE `timeMark` > ?", [ notification.timeMark ],
  //         (err, result) => {
  //           if (err != null) {
  //             return done(err, null)
  //           } else if (result === null || result.length === 0) {
  //             return done("No Notification found", null)
  //           } else {
  //
  //             const notifications = new Array[result.length]
  //             for (let i=0;i<result.length;i++) {
  //               notifications[i] = notification.fill(result[i])
  //             }
  //             return done(null, notifications)
  //           }
  //         })
  //     }
  //   } catch (e) {
  //     app.logger.error("Notification.get: Get data error. Error is [" + e + "] data is [" + this.showMe() + "]")
  //     return done("Get data error. ", null)
  //   }
  //   finally {
  //     mysql.end()
  //   }
  // }
}
