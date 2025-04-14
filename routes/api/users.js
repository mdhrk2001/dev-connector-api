const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys'); // Import keys for JWT secret
const passport = require('passport'); // Import passport for authentication

// Load input validation
const validateRegisterInput = require('../../validation/register'); // Import register validation
const validateLoginInput = require('../../validation/login'); // Import login validation

// Load User model
const User = require('../../models/User');

// @Route  GET api/users/test
// @Desc   Test users route
// @Access Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @Route  POST api/users/register
// @Desc   Register a new user
// @Access Public
router.post('/register', (req, res) => {
  // Validate input
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors); // Return errors if validation fails
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = 'Email already exists'; // If user exists, return error
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size of the avatar
          r: 'pg',  // Rating
          d: 'mm'   // Default avatar if none is found
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @Route  POST api/users/login
// @Desc   Login user & return JWT token
// @Access Public
router.post('/login', (req, res) => {

  // Validate input
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors); // Return errors if validation fails
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email })
    .then(user => {
      // Check if user exists
      if (!user) {
        errors.email = 'User not found'; // If user does not exist, return error
        return res.status(404).json(errors);
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {

            // User matched, -> create JWT token

            // Create JWT payload
            // The payload is the data that will be encoded in the JWT token
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };

            //Sign token
            jwt.sign(
              payload,
              keys.secretOrKey, // Secret key for signing the token
              { expiresIn: 3600 }, // Token expiration time (1 hour)
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token // Return the token in the response
                });
              }
            );

          } else {
            errors.password = 'Password incorrect'; // If password does not match, return error
            return res.status(400).json(errors);
          }
        });
    });
});

// @Route  GET api/users/current
// @Desc   Return current user
// @Access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
// This file defines a simple Express router for the `/api/users` endpoint.