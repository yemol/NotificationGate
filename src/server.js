import express from "express"
import cookie from "cookie-parser"
import bodyParser from "body-parser"
import path from "path"
import config from "./config.json"
import db from "./db"
import notificationListener from "./lib/NotificationListener"
import app from "./lib/app"
import tool from "./lib/tool"

// init log system for saving error log
const opts = {
  infoFile: './log/info.log',  // record info and verbose
  errFile: './log/err.log', // record error and warning
  logToConsole: true,
  timestamp: true, // default to true
  append: true // default to true
}
app.logger = require('elecpen').createLogger(opts)


app.set("views", "./views")
app.set('view engine', 'ejs')
app.use(cookie())
app.use(bodyParser())
// define the path of static files
app.use(express.static('./views/static'))

// site introduce page
app.get("/", function (req, res) {
  res.send(config.description + "<br>Current Version: " +  config.version + "<br>Author: " + config.author)
})

// add a new notification entry.
// The format of the request URL is following:
// Location?from=[notification from]&message=[notification message]
// Request Head:
// passcode = [passcode for remote validation]
// detail = [detail information for the message]
app.route('/add_notification')
  .get((req, res) => { tool.remoteValidation(req, res, notificationListener.listener) })
  .all( function (req, res) { res.end() } )

const server = app.listen(config.port, function (error) {
  console.log('Listening on port %d', server.address().port)
})
