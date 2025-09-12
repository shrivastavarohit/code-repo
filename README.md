# SRP Login

A clean login system with React + Spring Boot backend.

## What's inside?

- Login & Register pages with validation
- Protected dashboard
- JWT authentication
- Nice looking UI with Tailwind

## How to run

**Prerequisites:** Node.js 20+ and npm

```bash
# Install dependencies
npm install

# If Vite is not installed globally, install it
npm install vite

# Start the development server
npm run dev
```

Open http://localhost:5173

**Important:** Make sure your Spring Boot backend is running on port 8080.

## Stack

- React + TypeScript + Vite
- Redux Toolkit for state
- React Hook Form + Zod validation
- Tailwind CSS for styling
- React Router for navigation

## Troubleshooting

**"npm run dev" fails with Vite not found?**
Run `npm install vite` or `npm install -g vite` to install Vite globally.

**"Access Denied" on dashboard?**
Open browser console and run `localStorage.clear()`, then refresh.

**Login not working?**
Check that your backend is running on localhost:8080.

That's it! Simple authentication system ready to go.
