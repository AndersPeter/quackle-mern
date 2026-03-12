const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  const isProd = process.env.NODE_ENV === 'production'

  let message = err.message

  if (isProd) {
    // Sanitise Mongoose messages that could leak schema details
    if (err.name === 'CastError') message = 'Invalid resource ID'
    if (err.code === 11000) message = 'This resource already exists'
    if (statusCode === 500) message = 'Internal server error'
  }

  res.status(statusCode).json({
    message,
    ...(isProd ? {} : { stack: err.stack }),
  })
}

module.exports = { errorHandler }
