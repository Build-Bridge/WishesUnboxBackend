import mongoose from 'mongoose'

const connectDB = (): void => {
  mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/wishes_unbox')
    .then((conBool) => {
      console.log(`MongoDB Connected: ${conBool.connection.host}`)
    })
    .catch((error) => {
      console.error(`MongoDB Connection Error: ${error.message}`)
    })
}

export default connectDB
