import mongoose from 'mongoose'
import validator from 'validator'
import type ICard from '../interfaces/cardInterface'

const cardSchema = new mongoose.Schema({
  receiver: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Enter a valid email address']
  },
  wish: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 1000
  },
  occasion: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  }
},
{ timestamps: true }
)

const Card = mongoose.model<ICard>('Card', cardSchema)
export default Card
