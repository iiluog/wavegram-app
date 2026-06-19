# Wavegram

A mobile-first social media web app — think a lightweight Instagram clone — built as a Progressive Web App with React and TypeScript. Users can sign up, share image posts, like and comment, tag other users, and browse an infinite feed.

> **Note:** This is the **frontend** of the application. It talks to a separate REST API backend (configurable via environment variable).

## Features

- 🔐 **Authentication** — register / login with JWT access + refresh tokens, with automatic token refresh on `401`
- 📰 **Infinite feed** — paginated post feed with infinite scroll (SWR + `useSWRInfinite`)
- 🖼️ **Image posts** — multi-image posts with a swipeable carousel
- ❤️ **Likes & comments** — like posts and comment via a bottom drawer
- 🏷️ **User tagging** — tag other users in posts, with live user search
- 👤 **Profiles** — public user profiles, profile editing, and avatar upload
- 📱 **PWA** — installable, offline-capable via a Workbox service worker
- 🎨 **Modern UI** — Tailwind CSS, Radix UI primitives, MUI, and Lucide icons

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | React 18 + TypeScript (Create React App via CRACO) |
| Routing | React Router v6 |
| Data fetching | SWR (with `useSWRInfinite`) + Axios |
| State | Zustand + React Context |
| Styling | Tailwind CSS, Radix UI, MUI, `class-variance-authority` |
| PWA | Workbox |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A running instance of the Wavegram backend API

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/wavegram-app.git
cd wavegram-app

# Install dependencies
npm install

# Configure the backend URL
cp .env.example .env
# then edit .env and set REACT_APP_API_URL
```

### Available Scripts

```bash
npm start    # Run the dev server at http://localhost:3000
npm run build  # Build an optimized production bundle into /build
npm test     # Run the test runner
```

## Configuration

The app reads the backend base URL from an environment variable:

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Base URL of the backend API (no trailing slash). The app calls `<REACT_APP_API_URL>/api/...`. | `https://bigwave.bigrock.it` |

See [`.env.example`](./.env.example) for a template.

## Project Structure

```
src/
├── components/      # Feature components (feed, post, profile, auth)
│   ├── comments/    # Comments drawer, list, input
│   ├── post/        # Post header, carousel, actions, tags
│   └── ui/          # Reusable UI primitives (button, card, drawer…)
├── contexts/        # AuthContext (auth state + token handling)
├── services/        # apiSWR.js — API layer (Axios + SWR hooks)
├── stores/          # Zustand stores (current user)
├── utils/           # Image / date helpers
└── styles/          # Global styles & theme
```
