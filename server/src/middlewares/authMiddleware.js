/* eslint-disable consistent-return */
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const authenticateToken = (req, res, next) => {
  const authorizationHeader = req.header('Authorization')

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Access Denied - Token not provided' })
  }

  const [bearer, token] = authorizationHeader.split(' ')

  if (bearer !== 'Bearer' || !token) {
    return res
      .status(401)
      .json({ error: 'Access Denied - Invalid Authorization Header' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return res
            .status(401)
            .json({ error: 'Access Denied - Invalid Token' })
        }
        if (err.name === 'TokenExpiredError') {
          return res
            .status(401)
            .json({ error: 'Access Denied - Token Expired' })
        }
        return res.status(500).json({ error: 'Internal Server Error' })
      }
    }

    req.user = user
    next()
  })
}

export default authenticateToken
