'use strict'

import mysql from 'mysql'
import config from './config.json'
import app from '../../lib/app.js'


class Mysql {
  constructor () {
    this.connection = null
  }

  // we have to call this init method for each query to make sure connection is inited correctly.
  init () {
    try {
      this.connection = mysql.createConnection({
        host: config["mysqlconnect"],
        user: config["mysqlUserID"],
        password: config["mysqlPassword"]
      })

      if (this.connection === null) {
        throw new Exception("connection cannot be created")
      }
    } catch (e) {
      throw new Exception("Cannot create connection to database! Error is " + e)
    }
  }

  // This method is used to get index id of new crated row
  getInsertedID (result) {
    return result === null ? -1 : result.insertId
  }

  // This method is used to insert a new row into database
  insert (table, fields, values) {
    let fieldStr = ""
    let valueStr = ""
    for (let i = 0; i < fields.length ; i++) {
      fieldStr += "`" + fields[i] + "`,"
      valueStr += "?,"
    }
    fieldStr = fieldStr.substring(0, fieldStr.length-1)
    valueStr = valueStr.substring(0, valueStr.length-1)
    const command = "INSERT INTO `" + config.databaseName + "`.`" + table + "` (" + fieldStr + ") values(" + valueStr + ")"
    return this.query (command, values)
  }

  // This method is used to do a query in database
  query (command, paramters) {
    try {
      const myPromise = {}
      myPromise.Promise = new Promise(function (resolve, reject) {
        myPromise.resolve = resolve
        myPromise.reject = reject
      })

      this.init()
      this.connection.connect()
      app.logger.info("MySQL command: " + command)
      this.connection.query(command, paramters,
        (err, result) => {
          if (err != null) {
            myPromise.reject(err)
          } else {
            myPromise.resolve(result)
          }
        }
      )
      return myPromise.Promise
    }
    catch (e) {
      return Promise.reject("Exec insert comment error in database! Error is " + e)
    }
    finally {
      if (this.connection !== null) {
        this.connection.end ()
        this.connection = null
      }
    }
  }

  // connect () {
  //   try {
  //     if (this.connection === null) {
  //       this.connection = mysql.createConnection({
  //         host: config["mysqlconnect"],
  //         user: config["mysqlUserID"],
  //         password: config["mysqlPassword"]
  //       })
  //     }
  //     if (this.connection !== null) {
  //       this.connection.connect ()
  //       return true
  //     } else {
  //       app.logger.error ("connection cannot be created")
  //       return false
  //     }
  //   } catch (e) {
  //     app.logger.error ("Cannot create connection to database! Error is " + e, "mysqlAdapter.connect")
  //     return false
  //   }
  // }

}


module.exports = new Mysql()
