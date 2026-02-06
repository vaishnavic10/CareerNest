# Eminent-Hub

A unified platform for portfolios, resumes, job tracking, and blogging.

- **Live demo:** [https://eminenthub.vercel.app](https://eminenthub.vercel.app)  
- **Built with:** Next.js App Router, MongoDB, Firebase Auth, Tailwind CSS

---

## Highlights

- Portfolios and resume generation with PDF support.
- Job tracking with role-based access via middleware.
- Blogging with author enrichment from the Users collection.
- Global search across users and blogs.
- Feature requests with email notifications via Nodemailer.

---

## Table of Contents

- [Purpose](#purpose)  
- [Architecture](#architecture)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Local Setup](#local-setup)  
- [Environment](#environment)  
- [Development Scripts](#development-scripts)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Purpose

Eminent-Hub helps professionals manage portfolios, resumes, job applications, and blogs in one place. It integrates content, data, and workflows to streamline a personal professional hub.

---

## Architecture

The app uses Next.js App Router for UI and server modules. Data persists in MongoDB with a shared connection helper. Firebase handles client auth, while server code uses role-aware middleware to protect resources. Nodemailer sends emails for feature requests.

```mermaid
C4Container
title Eminent-Hub Architecture
Person(user, "End User")
System_Boundary(app, "Eminent-Hub (Next.js App Router)") {
  Container(ui, "React UI", "Next.js + Tailwind", "Pages, components, hooks")
  Container(api, "Server Modules", "Next.js API Routes", "CRUD for blogs, portfolios, jobs, etc.")
  Container(authCtx, "Auth Context", "React Context", "Tracks user and token")
}
System_Ext(firebase, "Firebase Auth", "Google/Firebase")
System_Ext(mongo, "MongoDB", "Atlas/ReplicaSet")
System_Ext(email, "SMTP", "Nodemailer")

Rel(user, ui, "Browses, edits, tracks")
Rel(ui, authCtx, "Reads auth/token")
Rel(ui, api, "Fetch JSON")
Rel(api, mongo, "Query/Update via clientPromise")
Rel(authCtx, firebase, "Sign-in/out")
Rel(api, email, "Send mail on feature request")
````

---

## Tech Stack

* **Framework:** Next.js App Router, React
* **Styling:** Tailwind CSS
* **Data:** MongoDB via official driver helper
* **Auth:** Firebase Web SDK (client) and Admin SDK (server)
* **Mail:** Nodemailer for SMTP

---

## Project Structure

```
src/app           # Routes/pages (App Router)
src/app/api       # Server modules: blog, portfolio, jobs, users, contact, website updates (secured with withAuth)
src/components    # Shared UI components, editor, resume PDF components, home sections
src/context       # Auth context provider and loader handling
src/hooks         # Data hooks for blogs, jobs, portfolio, logs
src/lib           # Data access layers and helpers: blog, portfolio, jobs, users, website updates, firebase admin, connection helper
```

---

## Local Setup

1. Ensure Node.js is installed.
2. Create a MongoDB database and connection string.
3. Create a Firebase project for client auth.

### Install Dependencies

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

### Build & Start Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

Create a `.env.local` with required variables. **Do not commit secrets.**

```bash
# MongoDB
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net"
MONGODB_DB="eminenthub"

# Firebase client (public) and Admin (server)
NEXT_PUBLIC_FIREBASE_API_KEY="<your-api-key>"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<your-auth-domain>"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="<your-project-id>"
FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY='{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "..."
}'

# SMTP for feature requests mailer
SMTP_HOST="smtp.example.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="username"
SMTP_PASSWORD="password"
```

---

## Development Scripts

* **Dev server:** `npm run dev`
* **Production build:** `npm run build && npm start`
* **Linting:** `npm run lint`

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit with descriptive messages.
4. Push and open a Pull Request.
5. Add tests or examples where relevant.



