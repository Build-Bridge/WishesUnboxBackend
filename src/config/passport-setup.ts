import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import User from '../models/user'

/**
 * Passport JWT Strategy
 */

const cookieExtractor = function (req: any): string | null {
  let token = null
  if (req?.cookies !== undefined) {
    token = req.cookies.token
  }
  return token
}

// JWT passport strategy
const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub)
    .then(user => {
      if (user === null) { // Add explicit null check
        done(null, false); return
      }
      done(null, user)
    })
    .catch(err => {
      done(err, false)
    })
}))

export default passport
