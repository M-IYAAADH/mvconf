# MVConf Frontend

Production-ready React frontend for the MVConf anonymous confession platform.

## Features

- **Anonymous Identity**: Cookie-based identity without login/signup
- **View Modes**: Hot (algorithmically ranked) and New (chronological) posts
- **Categories**: Filter by 6 distinct categories
- **Interaction**: Upvote/downvote posts and comments
- **Discussion**: Deeply nested comment threads
- **Search**: Full-text search with filtering by category, time, and sort order
- **Dark Mode**: Native dark theme design system

## Tech Stack

- **React 18**
- **Vite**
- **React Router v6**
- **CSS Modules** (Scoped styling)
- **Fetch API** (Custom wrapper)

## Project Structure

```
frontend/
├── src/
│   ├── api/          # API client and endpoints
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Route views
│   └── styles/       # Global styles and variables
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Development Notes

- The frontend expects the backend to be running at `http://localhost:8000`.
- Copy `.env.example` to `.env` to configure the API URL.
- **Identity**: The frontend relies entirely on `httpOnly` cookies from the backend. Ensure `credentials: 'include'` is set on all requests (handled by `api/client.js`).
