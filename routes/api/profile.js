const express = require('express');
const router = express.Router();

// @Route  GET api/profile/test
// @Desc   Test profile route
// @Access Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

module.exports = router;
// This file defines a simple Express router for the `/api/profile` endpoint.