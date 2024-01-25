import { type Request, type Response, type NextFunction } from 'express'
// Middleware to handle async errors
export default (func: (req: Request, res: Response, next: NextFunction) => Promise<void>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(error)
  }
}
