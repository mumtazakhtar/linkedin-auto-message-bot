const express = require('express');
const sendMessage = require('../sendMessage');
const router = express.Router();

router.post('/', async (req, res) => {
    const { profileUrl, message } = req.body;
    const result = await sendMessage(profileUrl, message);
    res.json(result);
});

module.exports = router;
