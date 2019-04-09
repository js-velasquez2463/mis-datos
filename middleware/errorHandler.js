const { HttpError } = require('http-errors')

const toJSON = (err, options = {}) => {
  const object = typeof err.toJSON === 'function'
    ? err.toJSON()
    : { message: err.message, stack: err.stack }

  if (!options.withStack) {
    object.stack = null
  }
  return object
}

module.exports = (error, req, res, next) => {
  let statusCode = error instanceof HttpError ? error.statusCode : 500

  if (error.errors) {
    statusCode = 400
  }

  res.status(statusCode)
    .send(toJSON(error, { withStack: req.app.get('env') === 'development' }))
}
