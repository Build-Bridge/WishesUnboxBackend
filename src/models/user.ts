import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Enter a valid email address']
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    match: /^[a-z0-9_-#$]+$/,
    validate: {
      validator: (username: string) => !username.includes(' '),
      message: 'Username cannot contain spaces'
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 1024,
    select: false
  },
  dateOfBirth: { type: Date, required: true }
},
{ timestamps: true })

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Hash the password before saving the user model
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)
export default User
