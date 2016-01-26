import config from "../config.json"
import app from "./app.js"
import { OperationLog } from "../db"
import tool from "./tool.js"

exports.listener = (req, res) => {
  // get required info from request
  const operation = req.query.o
  const clientInfo  = req.query.i
  const clientAddress = req.query.a

  // check required info in request. We will return 400 if any one is missing.
  if (operation === undefined || clientInfo.length === 0 || clientAddress === undefined) {
    res.statusCode = 400
    res.json({ "error": "Please include required info!" })
    res.end()
  }

  const operationLog = new OperationLog()
  operationLog.operation = operation
  operationLog.clientInfo = clientInfo
  operationLog.clientAddress = clientAddress
  app.logger.info(operationLog.showMe())

  operationLog.addOne(operationLog, (err, result) => {
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
