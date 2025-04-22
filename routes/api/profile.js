const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validation function
const validateProfileInput = require('../../validation/profile'); // Import validation function
const validateExperienceInput = require('../../validation/experience'); // Import experience validation function
const validateEducationInput = require('../../validation/education'); // Import education validation function

// Load Profile model
const Profile = require('../../models/Profile');
// Load User model
const User = require('../../models/User');

// @Route  GET api/profile/test
// @Desc   Test profile route
// @Access Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// @Route  GET api/profile
// @Desc   Get current user's profile
// @Access Private
router.get('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    // Find the profile by user ID
    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar']) // Populate user data
      .then(profile => {
        if (!profile) {     
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @Route  GET api/profile/all
// @Desc   Get all profiles
// @Access Public
router.get('/all', (req, res) => {
  const errors = {};
  // Find all profiles
  Profile.find()
    .populate('user', ['name', 'avatar']) // Populate user data
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles'; // If no profiles found, return error
        return res.status(404).json(errors);
      }

      res.json(profiles); // If profiles found, return them
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' })); // Handle any errors
});


// @Route  GET api/profile/handle/:handle
// @Desc   Get profile by handle
// @Access Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};

  // Find the profile by handle
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar']) // Populate user data
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors); // If no profile found, return error
      }

      res.json(profile); // If profile found, return it
    })
    .catch(err => res.status(404).json(err)); // Handle any errors
});

// @Route  GET api/profile/user/:user_id
// @Desc   Get profile by user ID
// @Access Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  // Find the profile by handle
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar']) // Populate user data
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors); // If no profile found, return error
      }

      res.json(profile); // If profile found, return it
    })
    .catch(err => res.status(404).json({profile: 'There is no profile for this user'})); // Handle any errors
});

// @Route  POST api/profile
// @Desc   Create or edit user profile
// @Access Private
router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {

        const {errors, isValid } = validateProfileInput(req.body); // Validate input data

        // Check for validation errors
        if (!isValid) {
            return res.status(400).json(errors); // If errors exist, return them
        }

      // Get fields from request body
      const profileFields = {};
        profileFields.user = req.user.id; // Set user ID from JWT token
        if (req.body.handle) profileFields.handle = req.body.handle; // Set handle if provided
        if (req.body.company) profileFields.company = req.body.company; // Set company if provided
        if (req.body.website) profileFields.website = req.body.website; // Set website if provided
        if (req.body.location) profileFields.location = req.body.location; // Set location if provided
        if (req.body.bio) profileFields.bio = req.body.bio; // Set bio if provided
        if (req.body.status) profileFields.status = req.body.status; // Set status if provided
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername; // Set GitHub username if provided

        // Skills array
        if (typeof req.body.skills !== 'undefined') {
          profileFields.skills = req.body.skills.split(','); // Split skills string into array
        }

        // Social links
        profileFields.social = {}; // Initialize social object
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube; // Set YouTube link if provided
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter; // Set Twitter link if provided
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook; // Set Facebook link if provided
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin; // Set LinkedIn link if provided
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram; // Set Instagram link if provided

        Profile.findOne({ user: req.user.id }) // Check if profile exists
          .then(profile => {
            if (profile) {
              // Update existing profile
              Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true } // Return the updated profile
              ).then(profile => res.json(profile)); // Send updated profile as response
            } else {
              // Create new profile

              // Check if handle already exists
              Profile.findOne({ handle: profileFields.handle }).then(profile => {
                if (profile) {
                  errors.handle = 'That handle already exists'; // If handle exists, return error
                  res.status(400).json(errors);
                }

                // Save new profile
                new Profile(profileFields).save().then(profile => res.json(profile)); // Save and send new profile as response
              });
            }
          });
    }
);

// @Route  POST api/profile/experience
// @Desc   Add experience to profile
// @Access Private
router.post('/experience',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const {errors, isValid } = validateExperienceInput(req.body); // Validate input data

        // Check for validation errors
        if (!isValid) {
            return res.status(400).json(errors); // If errors exist, return them
        }

        Profile.findOne({ user: req.user.id }) // Find profile by user ID
          .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };
            // Add new experience to profile
            profile.experience.unshift(newExp); // Unshift adds the new experience to the beginning of the array

            profile.save().then(profile => res.json(profile)); // Save and send updated profile as response
          });
    }
);

// @Route  POST api/profile/education
// @Desc   Add education to profile
// @Access Private
router.post('/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
      const {errors, isValid } = validateEducationInput(req.body); // Validate input data

      // Check for validation errors
      if (!isValid) {
          return res.status(400).json(errors); // If errors exist, return them
      }

      Profile.findOne({ user: req.user.id }) // Find profile by user ID
        .then(profile => {
          const newEdu = {
              school: req.body.school,
              degree: req.body.degree,
              fieldofstudy: req.body.fieldofstudy,
              from: req.body.from,
              to: req.body.to,
              current: req.body.current,
              description: req.body.description
          };
          // Add new education to profile
          profile.education.unshift(newEdu); // Unshift adds the new education to the beginning of the array

          profile.save().then(profile => res.json(profile)); // Save and send updated profile as response
        });
  }
);

// @Route  DELETE api/profile/experience/:exp_id
// @Desc   Delete experience from profile
// @Access Private
router.delete('/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
      
      Profile.findOne({ user: req.user.id }) // Find profile by user ID
        // Get index of experience to be removed
        .then(profile => {
          const removeIndex = profile.experience
            .map(item => item.id) // Map experience items to their IDs
            .indexOf(req.params.exp_id); // Find index of the experience to be removed

          // Splice out of array
          profile.experience.splice(removeIndex, 1); // Remove experience from array

          // Save and send updated profile as response
          profile.save().then(profile => res.json(profile)); 
        })
        .catch(err => res.status(404).json(err)); // Handle any errors
  }
);

// @Route  DELETE api/profile/education/:edu_id
// @Desc   Delete education from profile
// @Access Private
router.delete('/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
      
      Profile.findOne({ user: req.user.id }) // Find profile by user ID
        // Get index of education to be removed
        .then(profile => {
          const removeIndex = profile.education
            .map(item => item.id) // Map education items to their IDs
            .indexOf(req.params.edu_id); // Find index of the education to be removed

          // Splice out of array
          profile.education.splice(removeIndex, 1); // Remove education from array

          // Save and send updated profile as response
          profile.save().then(profile => res.json(profile)); 
        })
        .catch(err => res.status(404).json(err)); // Handle any errors
  }
);

// @Route  DELETE api/profile
// @Desc   Delete user and profile
// @Access Private
router.delete('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

      Profile.findOneAndDelete({ user: req.user.id }) // Find and delete profile by user ID
        .then(() => {
          User.findOneAndDelete({ _id: req.user.id }) // Find and delete user by ID
            .then(() => res.json({ success: true })); // Send success response
        });
  }
)

module.exports = router;