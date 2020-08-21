const router = require('express').Router();
const users = require('./auth-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const constants = require('../config/constants')

router.post('/register', validateUserRequest, (req, res) => {
  const credentials = req.body
  const hash = bcrypt.hashSync(credentials.password, 8)

  credentials.password = hash

  users.add(credentials)
    .then(id => {
      res.json({id})
    })
    .catch(err => {
      res.status(500).json({error: "There was a problem adding the record to the database"})
    })
});

router.post('/login', validateUserRequest, (req, res) => {
  const {username, password} = req.body

  users.getBy({username: username})
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user)

        res.json({
          message: "you are now logged in",
          token
        })
      }
    })
});

function validateUserRequest(req, res, next) {
  if (!req.body.username || !req.body.password) return (
    res.status(400).json({error: "invalid request - missing credentials"})
  )
  next()
}

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }

  const secret = constants.jwtSecret

  const options = {
    expiresIn: "1d"
  }

  return jwt.sign(payload, secret, options)
}

module.exports = router;
