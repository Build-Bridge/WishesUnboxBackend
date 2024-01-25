import User from '../models/user'
import type IUser from '../interfaces/userInterface'
import asyncErrors from '../middlewares/asyncError'
import ErrorHandler from '../utils/errorHandler'
import sendToken from '../utils/sendToken'

// basic user signup
export const signup = asyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, userName, password, dateOfBirth } = req.body
  try {
    const oldUser: IUser | null = await User.findOne({ email }).lean()
    if (oldUser !== null) {
      next(new ErrorHandler('User already exists', 400))
      return
    }

    const user: IUser = new User({ firstName, lastName, email, userName, password, dateOfBirth })

    await user.save()
    sendToken(user, 201, res)
  } catch (err) {
    next(err)
  }
})

// basic user login
export const login = asyncErrors(async (req, res, next) => {
  const { emailOrUsername, password } = req.body
  if (emailOrUsername === null || password === null) {
    next(new ErrorHandler('Please enter email and password', 400)); return
  }

  const isEmail: boolean = emailOrUsername.includes('@')

  let user: IUser | null
  if (isEmail) {
    user = await User.findOne({ email: emailOrUsername }).select('+password') as IUser
  } else {
    user = await User.findOne({ userName: emailOrUsername }).select('+password') as IUser
  }

  if (user === null) {
    next(new ErrorHandler('Invalid email or password', 401)); return
  }

  const isPasswordValid = user.validatePassword(password as string)
  if (!isPasswordValid) {
    next(new ErrorHandler('Invalid email or password', 401))
    return
  }

  sendToken(user, 200, res)
})
