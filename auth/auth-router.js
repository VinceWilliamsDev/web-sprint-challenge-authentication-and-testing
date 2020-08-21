const router = require('express').Router();
const users = require('./auth-model')
const bcrypt = require('bcrypt')

router.post('/register', validateUserRequest, (req, res) => {
  const {username, password} = req.body
  const hashedPassword = bcrypt.hashSync(password, 8)

  users.add({username, hashedPassword})
    .then(res => {

    })
    .catch(err => {
      res.status(500).json({error: "There was a problem adding the record to the database"})
    })
});

router.post('/login', validateUserRequest, (req, res) => {
  // implement login
});

function validateUserRequest(req, res, next) {
  if (!req.body.username || !req.body.password) return (
    res.status(400).json({error: "invalid request - missing credentials"})
  )
  next()
}

module.exports = router;
