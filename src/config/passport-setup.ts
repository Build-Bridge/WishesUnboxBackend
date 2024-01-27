import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
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

/**
 * Google 0Auth2.0 passport strategy
 */

// serialize
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

// deserialize
passport.deserializeUser(async (id: any, done) => {
  const user = await User.findById(id)
  done(null, user)
})

// create a new user with google
const createUser = async (email: string, name: string) => {
  const [firstName, lastName] = name.split(' ')
  const userName = email.split('@')[0]

  const user = new User({ email, firstName, lastName, userName })
  await user.save()
  return user
}

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: '/google/redirect'
  }, async (_accessToken: string, _refreshToken: string, profile: any, done) => {
    const email = (profile.emails && profile.emails[0]?.value) || ''
    try {
      const user = await User.findOne({ email })
      if (user === null) {
        const name = profile.displayName
        const newUser = await createUser(email, name)
        return done(null, newUser)
      }
      return done(null, user)
    } catch (err) {
      return done(err as Error, false)
    }
  })
)

export default passport
