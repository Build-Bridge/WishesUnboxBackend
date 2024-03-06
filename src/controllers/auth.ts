import User from '../models/user'
import type IUser from '../interfaces/userInterface'
import asyncErrors from '../middlewares/asyncError'
import ErrorHandler from '../utils/errorHandler'
import sendToken from '../utils/sendToken'
import sendEmail from '../utils/mailer'

// basic user signup
export const signup = asyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, userName, password } = req.body
  let { dateOfBirth } = req.body
  try {
    const oldUser: IUser | null = await User.findOne({ email }).lean()
    if (oldUser !== null) {
      next(new ErrorHandler('User already exists', 400))
      return
    }
    dateOfBirth = new Date(dateOfBirth as string)

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

// forgot password
export const forgotPassword = asyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  // check if user exists
  if (user === null) { next(new ErrorHandler('User not found', 404)); return }

  // get reset token
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  // create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`
  const message: string = `Your password reset token is as follows:<br>${resetUrl}.<br>If you have not requested this email, please ignore it.`
  // send email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Wishes Unbox - Password Recovery',
      message
    })
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`
    })
  } catch (err: Error | any) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })
    next(new ErrorHandler(err.message as string, 500))
  }
})

// reset password
export const resetPassword = asyncErrors(async (req, res, next) => {
  const { password, confirmPassword } = req.body

  const resetPasswordToken = req.params.resettoken
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (user === null) {
    next(new ErrorHandler('Invalid reset token', 400)); return
  }

  if (password !== confirmPassword) {
    next(new ErrorHandler('Password does not match', 400)); return
  }

  // setup new password
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()
  sendToken(user, 200, res)
})
