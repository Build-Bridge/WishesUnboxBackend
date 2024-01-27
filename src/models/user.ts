import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import type IUser from '../interfaces/userInterface'

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
    match: /^[a-z0-9_\-#$]+$/,
    validate: {
      validator: (username: string) => !username.includes(' '),
      message: 'Username cannot contain spaces'
    }
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    maxlength: 1024,
    select: false
  },
  dateOfBirth: { type: Date },
  resetPasswordToken: String,
  resetPasswordExpire: Date
},
{ timestamps: true })

// hash password before saving to database
userSchema.pre('save', async function (this: IUser, next) {
  if (this.isModified('password') && this.password !== undefined) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

// validates inserted password against hashed password
userSchema.methods.validatePassword = async function (insertedPassword: string) {
  return await bcrypt.compare(insertedPassword, this.password || '')
}

userSchema.methods.generateAuthToken = function () {
  // Generate an auth token for the user
  const payload = { sub: this._id, username: this.userName }
  const token = jwt.sign(payload, process.env.JWT_SECRET ?? 'secret', { expiresIn: process.env.JWT_EXPIRE ?? '1h' })
  return token
}

// generates password reset token
userSchema.methods.getResetPasswordToken = function () {
  // generate the reset token
  const resetToken = crypto.randomBytes(64).toString('hex')

  // hassh and save this token to the resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000 // 30 minutes

  return resetToken
}

const User = mongoose.model<IUser>('User', userSchema)
export default User
