# Fullstack Amplify

Fullstack Amplify is a social-feed application built with Astro, React, Redux Toolkit, and MongoDB. It includes authentication, a protected home feed, post creation with optional images, post visibility controls, nested comments, and like/unlike reactions.

## Overview

The project uses Astro as the server/runtime layer and mounts a React application for the client UI. MongoDB stores users and posts. Each post embeds its own comments and reactions so the feed can render from a small number of queries.

Main features:

- User registration and login
- Protected home feed
- Text-only post creation
- Post creation with an image
- Post visibility control
- Infinite scrolling feed
- Nested comments
- Like/unlike reactions
- Optional Bunny CDN image storage

## Tech Stack

- Astro
- React
- React Router
- Redux Toolkit
- Redux Persist
- MongoDB with Mongoose
- JSON Web Token authentication
- Bunny CDN for optional image uploads

## Application Flow

### Frontend

- [src/pages/[...index].astro](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/pages/[...index].astro) mounts the React app inside Astro.
- [src/components/App.tsx](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/components/App.tsx) defines the route tree.
- [src/components/ProtectedRoute.tsx](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/components/ProtectedRoute.tsx) protects the home feed in the UI.
- [src/components/pages/login/index.tsx](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/components/pages/login/index.tsx) handles login.
- [src/components/pages/register/index.tsx](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/components/pages/register/index.tsx) handles registration.
- [src/components/pages/home/index.tsx](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/components/pages/home/index.tsx) handles feed rendering, post creation, comments, reactions, and infinite scroll.

### Backend

- [src/middleware.ts](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/middleware.ts) prepares the MongoDB connection for requests.
- [src/lib/connection.ts](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/lib/connection.ts) manages the Mongoose connection.
- [src/model/User.ts](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/model/User.ts) defines the user schema and password hashing.
- [src/model/Post.ts](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/model/Post.ts) defines posts with embedded comments and reactions.
- [src/pages/api](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/pages/api) contains authentication and feed APIs.

## Project Structure

```text
.
+-- public/
+-- src/
|   +-- components/
|   |   +-- pages/
|   |       +-- home/
|   |       +-- login/
|   |       +-- register/
|   +-- layouts/
|   +-- lib/
|   +-- model/
|   +-- pages/
|   |   +-- api/
|   +-- redux/
|   +-- styles/
|   +-- types/
|   +-- utils/
+-- .env.example
+-- astro.config.mjs
+-- package.json
```

## UI Routes

- `/login` - login page
- `/register` - registration page
- `/` - protected home feed

## API Routes

- `POST /api/register` - create a new user
- `POST /api/login` - validate credentials and return a JWT
- `POST /api/posts` - create a post with optional image upload
- `GET /api/getspost` - fetch paginated posts
- `PATCH /api/comments` - add a nested comment to a post
- `PATCH /api/reaction` - toggle like/unlike for a post
- `GET /api/[id]` - fetch one user by id

## Data Models

### User

The user model stores:

- `email`
- `firstName`
- `lastName`
- `password`
- `createdAt`

Passwords are hashed in the Mongoose `pre("save")` hook.

### Post

The post model stores:

- `author`
- `title`
- `image`
- `visibility`
- `time`
- `reactionCount`
- `commentCount`
- `shareCount`
- `commentPreview`
- `topReactions`
- `comments`
- `reactions`
- `createdAt`
- `updatedAt`

Comments and reactions are embedded inside the post document. That keeps feed reads simple because a single post query can include the nested activity needed for the UI.

## Feed Features

### Post creation

The home route supports:

- text-only posts
- text-plus-image posts

The image picker opens through a hidden file input in the home composer.

### Visibility

The current post model supports these visibility values:

- `Public`
- `Friends`
- `Only Me`

The home feed currently treats `Public` posts as visible to everyone and keeps private posts visible to their author only.

### Comments

Comments are stored in `post.comments`. The comments API appends a nested comment and returns the updated post so the UI can update immediately.

### Reactions

Reactions are stored in `post.reactions`. The reaction API toggles a user's `Like` reaction and updates:

- `reactions`
- `reactionCount`
- `topReactions`

## Environment Variables

Copy [.env.example](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/.env.example) to `.env` and replace the values with your own.

```env
# MongoDB
PUBLIC_MONGODB_URI=

# JWT
PUBLIC_JWT_SECRET=

# Bunny CDN
BUNNY_STORAGE_ZONE_NAME=
BUNNY_STORAGE_REGION_HOSTNAME=
BUNNY_STORAGE_API_KEY=

# Optional public URL for uploaded images
BUNNY_PUBLIC_BASE_URL=
```

Notes:

- If `BUNNY_PUBLIC_BASE_URL` is not set, uploaded images fall back to inline data URLs.
- Do not keep real secrets in `.env.example` or commit real credentials into the repository.

## Getting Started

### Prerequisites

- Node.js `>=22.12.0`
- pnpm
- MongoDB database

### Install dependencies

```sh
pnpm install
```

### Start the development server

```sh
pnpm dev
```

## Scripts

| Command | What it does |
| :-- | :-- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the Astro dev server |
| `pnpm build` | Build the project |
| `pnpm preview` | Preview the production build locally |
| `pnpm astro` | Run Astro CLI commands |

## Redux State

Redux is used mainly for authentication and lightweight profile workflow state.

Relevant files:

- [src/redux/store.ts](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/redux/store.ts)
- [src/redux/slices/authSlice.ts](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/redux/slices/authSlice.ts)
- [src/redux/slices/profileSlice.ts](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/src/redux/slices/profileSlice.ts)

Authentication state is persisted so the user session survives browser refreshes.

## Important Notes

- `ProtectedRoute` is only a client-side route guard. Sensitive API actions should still validate user identity on the server.
- Some serializers keep compatibility fallbacks such as `id` and `authorid` to support older data.
- Astro is configured with `output: "server"` in [astro.config.mjs](/d:/All%20Projects%20,Code/Projects/Fullstack-amplify/astro.config.mjs).
- The home feed uses infinite scrolling instead of a manual "load more" button.

## Suggested Improvements

- Move protected API actions to token-based authorization instead of trusting ids sent from the client
- Add tests for API routes and feed interactions
- Normalize visibility handling if `Friends` is not needed
- Add edit and delete flows for posts
- Add stronger validation and rate limiting for public endpoints

## Development Tip

If you change Mongoose schemas during development, restart the dev server so the latest model definition is loaded cleanly.
