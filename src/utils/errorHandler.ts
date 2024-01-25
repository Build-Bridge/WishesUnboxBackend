/**
 * Custom error handler class.
 * @class
 * @extends Error
 */
class ErrorHandler extends Error {
  statusCode: number // Define the statusCode property

  constructor (message: string, statusCode: number) { // Add type annotations to the constructor parameters
    super(message)
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}

// Export error handler.
export default ErrorHandler
