import crypto from "crypto"
import config from "../config.json"

// this method used to check remote validation code send with any remote request.
// If validation is failed, a 404 status will be send back
exports.remoteValidation = (req, res, next) => {
  const passcode = req.get("passcode")
  if (passcode === config.remotePasscode) {
    next (req, res)
  } else {
    res.statusCode = 404
    res.end()
  }
}

exports.sha1 = function (content) {
  const sha1 = crypto.createHash("sha1")
  sha1.update(content)
  return sha1.digest("hex")
}
