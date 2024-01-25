import type { Response } from 'express'
import type IUser from '../interfaces/userInterface'

// create and send a token in a cookie
const sendToken = (user: IUser, statusCode: number, res: Response): void => {
  // create token
  const token = user.generateAuthToken()

  // cookie options
  const options = {
    expires: new Date(
      Date.now() + ((parseInt(process.env.COOKIE_EXPIRATION ?? '1') ?? 1) * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user
  })
}

export default sendToken
