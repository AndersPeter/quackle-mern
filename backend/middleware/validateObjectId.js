const { isValidObjectId } = require('mongoose')

const validateObjectId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400)
    return next(new Error('Invalid ID'))
  }
  next()
}

module.exports = validateObjectId
