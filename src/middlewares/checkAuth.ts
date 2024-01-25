import passport from 'passport'

const isAuthenticated = (req: any, res: any, next: any) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
        if (err || !user) {
            passport.authenticate('google', { session: true }, (err: any, user: any) => {
                if (err || !user) {
                    return res.status(401).json({ message: 'Unauthorized' })
                }
                req.user = user
                return next()
            })(req, res, next)
        }
        req.user = user
        return next()
    })(req, res, next)
}

export default isAuthenticated
