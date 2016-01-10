import config from "../config.json"
import app from "./app.js"
import { Notification } from "../db"
import tool from "./tool.js"

exports.listener = (req, res) => {
  // get required info from request
  const message = req.query.m
  const messageFrom  = req.query.f
  const detail = req.get("detail")

  // check required info in request. We will return 400 if any one is missing.
  if (message === undefined || message.length === 0 || messageFrom === undefined || messageFrom.length === 0) {
    res.statusCode = 400
    res.json({ "error": "Please include message and from info!" })
    res.end()
  }

  const notification = new Notification()
  notification.message = message
  notification.detail = detail
  notification.from = messageFrom
  app.logger.info(notification.showMe())

  // res.statusCode = 200
  // res.end()
  // return

  notification.addOne(notification, (err, result) => {
    if (err === null)
    {
      // we will return 200 status if we saved notification into database
      app.logger.info(result)
      res.status(200).json({ "id": result }).end()
    }
    else {
      // we will return 400 status if we cannot save notification into database
      res.status(400).json({ "error": "Infonation you provided is incorrect!" }).end()
    }
  })

}
