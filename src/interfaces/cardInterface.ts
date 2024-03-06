import { type Document } from 'mongoose'

export default interface ICard extends Document {
  receiver: string
  sender: string
  email: string
  wish: string
  occasion: string
}
