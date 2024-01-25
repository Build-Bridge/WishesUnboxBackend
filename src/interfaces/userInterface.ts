import { type Document } from 'mongoose'

export default interface IUser extends Document {
  firstName?: string
  lastName?: string
  email?: string
  userName?: string
  password?: string
  dateOfBirth?: Date
  generateAuthToken: () => string
  validatePassword: (password: string) => boolean
}
