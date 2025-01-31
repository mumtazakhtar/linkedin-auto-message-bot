const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
    name: String,
    currentJob: String,
    company: String,
    linkedinUrl: String
});
module.exports = mongoose.model('Profile', ProfileSchema);
