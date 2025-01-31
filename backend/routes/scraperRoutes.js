const express = require('express');
const scrapeLinkedInProfiles = require('../scraper');
const Profile = require('../models/Profile');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password, searchQuery } = req.body;

    if (!email || !password || !searchQuery) {
        return res.status(400).json({ error: "Missing required fields (email, password, searchQuery)" });
    }

    // Scrape LinkedIn profiles
    const response = await scrapeLinkedInProfiles(email, password, searchQuery);

    // Handle error response from scraper
    if (response.error) {
        return res.status(500).json({ error: response.error });
    }

    // Save profiles to MongoDB
    try {
        await Profile.insertMany(response.profiles, { ordered: false }); // Ignore duplicates
        console.log('Profiles successfully saved to MongoDB');
    } catch (err) {
        console.error('Error saving profiles:', err);
    }

    return res.json(response);
});

module.exports = router;
