# Shiva Enterprises v2 (React + Vite + Node.js)

This is a modernized, secure version of the Shiva Enterprises gallery website. It addresses the security warnings from Google Cloud by moving sensitive logic to a backend server.

## Security Improvements
- **No API Keys in Client**: Sensitive Firebase API keys are no longer exposed in the browser's source code.
- **Firebase Admin SDK**: The server uses the Firebase Admin SDK to interact with the database securely.
- **Environment Variables**: Credentials are handled via `.env` files (not committed to version control).

## Project Structure
- `/client`: React Vite application (Frontend)
- `/server`: Node.js Express application (Backend)

## Setup Instructions

### 1. Server Setup
1. Go to your Firebase Console -> Project Settings -> Service Accounts.
2. Click "Generate new private key".
3. Save the JSON file as `server/serviceAccountKey.json`.
4. Run `cd server && npm install`.
5. Start the server: `node index.js`.

### 2. Client Setup
1. Run `cd client && npm install`.
2. Start the development server: `npm run dev`.

## Features
- **Premium Design**: Same elegant gold/dark aesthetic.
- **Responsive Gallery**: Works beautifully on all devices.
- **WhatsApp Integration**: Streamlined lead generation for gates, railings, and grills.
- **Video Support**: Smooth playback for design showcases.
