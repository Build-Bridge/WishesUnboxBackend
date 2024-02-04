import dotenv from 'dotenv'
import app from './app'
import connectDB from './config/db'

// eslint-disable-next-line n/no-path-concat
dotenv.config({ path: __dirname + '/config/.env' })

connectDB()

const PORT = process.env.PORT ?? 3000
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// process.on('uncaughtException', (err: Error) => {
//   console.log('Shutting server down due to uncaught exception...')
//   console.log(`Error: ${err.message}`)

//   // Close server.
//   process.exit(1)
// })

// // Handle unhandled promise rejections.
// process.on('unhandledRejection', (err: Error) => {
//   console.log(`Error: ${err.message}`)
//   // Close server & exit process.
//   console.log('Shutting server down due to unhandled promise rejections...')
//   server.close(() => process.exit(1))
// })
