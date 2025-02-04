const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDatabase = require('./database');
const scraperRoutes = require('./routes/scraperRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

connectToDatabase();
app.use('/scrape', scraperRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
