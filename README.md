# Lost & Found System

A full-stack MERN application for reporting lost or found items, submitting ownership claims, approving claim requests, and coordinating recovery through a secure chat workflow.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, React Hot Toast
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary
- Deployment: Vercel, Render, MongoDB Atlas

## Features

- User registration and login
- Lost and found item reporting
- Image uploads with Cloudinary
- Claim request workflow
- Claim approval and rejection
- Chat between owner and claimant
- Owner contact visibility after approval
- User dashboard
- Admin dashboard
- SEO-ready frontend metadata

## Project Structure

- `client/` frontend application
- `server/` backend API

## Environment Setup

Copy these example files and fill in real values:

- [client/.env.example](c:/Users/Nitesh/OneDrive/Documents/lost-found-system/client/.env.example)
- [server/.env.example](c:/Users/Nitesh/OneDrive/Documents/lost-found-system/server/.env.example)

### Frontend

```env
VITE_API_URL=https://lost-found-system-8q05.onrender.com/api
```

For local development, you can use:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=https://lost-found-system.vercel.app
CLIENT_URLS=http://localhost:5173
ADMIN_EMAILS=niteshndmaster@gmail.com
NODE_ENV=production
```

## Local Development

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Production Deployment

### Backend on Render

Deploy the `server` folder and configure the environment variables from `server/.env.example`.

Important:

- Set `CLIENT_URL` to your final Vercel frontend URL
- Current frontend URL: `https://lost-found-system.vercel.app`
- Set `ADMIN_EMAILS` if you want specific email addresses to automatically receive admin access
- Keep all secrets only in Render environment settings
- Do not commit real credentials

### Frontend on Vercel

Deploy the `client` folder and set:

```env
VITE_API_URL=https://lost-found-system-8q05.onrender.com/api
```

Current production URLs:

- Frontend: `https://lost-found-system.vercel.app`
- Backend: `https://lost-found-system-8q05.onrender.com`

## Verification

Frontend checks:

```bash
cd client
npm run lint
npm run build
```

Backend syntax check:

```bash
cd server
node --check server.js
```

## Notes

- The footer appears on the landing page only, not across the full app shell
- Backend CORS is now environment-driven through `CLIENT_URL` and `CLIENT_URLS`
- The frontend API client no longer assumes localhost by default
- Rotate any exposed secrets before pushing publicly
