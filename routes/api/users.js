const express = require('express');
const router = express.Router();

// @Route  GET api/users/test
// @Desc   Test users route
// @Access Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

module.exports = router;
// This file defines a simple Express router for the `/api/users` endpoint.