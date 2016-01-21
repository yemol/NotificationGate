'use strict'

import mysql from 'mysql'
import config from './config.json'
import app from '../../lib/app.js'


class Mysql {
  // Static constructor, used to create mysql connection pool.
  static constructor () {
    this.pool  = mysql.createPool({
      connectionLimit: config["connectionLimit"],
      host: config["mysqlconnect"],
      user: config["mysqlUserID"],
      password: config["mysqlPassword"]
    })
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

      this.pool.getConnection( (err, con) => {
        if (err) {
          if (con) { con.release() }
          return myPromise.reject(err)
        }
        else {
          app.logger.info("MySQL command: " + command)
          con.query(command, paramters,
            (err, result) => {
              if (err) {
                if (con) { con.release() }
                return myPromise.reject(err)
              }
              else {
                if (con) { con.release() }
                myPromise.resolve(result)
              }
            }
          )
          return myPromise.Promise
        }
      })
    }
    catch (e) {
      return Promise.reject("Exec insert comment error in database! Error is " + e)
    }
  }

}


module.exports = new Mysql()
