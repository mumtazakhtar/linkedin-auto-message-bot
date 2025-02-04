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
1. Install dependencies:
    ```sh
    npm install
    ```
2. Start the server:
    ```sh
    npm start
    ```

## Usage
- The backend server will run on `http://localhost:3000`.
- API endpoints are available for user authentication and data scraping.

## API Endpoints
- `POST /login`: Logs in the user and starts a scraping session.