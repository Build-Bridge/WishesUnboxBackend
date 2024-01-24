import dotenv from 'dotenv'
import app from './app'

dotenv.config({ path: './config/.env' })

const PORT = process.env.PORT ?? 3000
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

process.on('uncaughtException', (err: Error) => {
  console.log('Shutting server down due to uncaught exception...')
  console.log(`Error: ${err.message}`)

  // Close server.
  process.exit(1)
})

// Handle unhandled promise rejections.
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process.
  console.log('Shutting server down due to unhandled promise rejections...')
  server.close(() => process.exit(1))
})
