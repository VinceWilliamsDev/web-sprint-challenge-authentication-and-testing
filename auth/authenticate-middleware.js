/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const constants = require('../config/constants')
const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if(token){
    jwt.verify(token, constants.jwtSecret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ you: 'shall not pass!' })
      } else {
        req.decodedToken = decodedToken

        next()
      }
    })
  } else {
    res.status(401).json({error: "Please provide credentials"})
  }
};
