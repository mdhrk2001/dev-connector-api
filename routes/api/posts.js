const express = require('express');
const router = express.Router();

// @Route  GET api/posts/test
// @Desc   Test posts route
// @Access Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

module.exports = router;
// This file defines a simple Express router for the `/api/posts` endpoint.