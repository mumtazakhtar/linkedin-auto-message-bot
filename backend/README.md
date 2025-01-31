# Backend

## Overview
This is the backend service for the LinkedIn scraper application. It handles user authentication, data scraping, and data storage.

## Technologies Used
- Node.js
- Express
- Puppeteer
- MongoDB

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name/backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the [backend](http://_vscodecontentref_/0) directory and add your environment variables:
    ```env
    MONGODB_URI=your_mongodb_uri
    LINKEDIN_EMAIL=your_linkedin_email
    LINKEDIN_PASSWORD=your_linkedin_password
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Usage
- The backend server will run on `http://localhost:3000`.
- API endpoints are available for user authentication and data scraping.

## API Endpoints
- `POST /login`: Logs in the user and starts a scraping session.
- `GET /profile`: Retrieves the logged-in user's profile information.

## License
This project is licensed under the MIT License.