<!-- prettier-ignore -->
<div align="center">

# Axiom Prompts

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](https://github.com)
![Node version](https://img.shields.io/badge/Node.js->=18-3c873a?style=flat-square)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)

⭐ If you like this project, star it on GitHub — it helps a lot!

[Overview](#overview) • [Getting Started](#getting-started) • [Features](#features) • [Tech Stack](#tech-stack) • [Development](#development) • [Deployment](#deployment)

</div>

A modern, full-stack application for managing and sharing AI prompts. Built with React, TypeScript, and Express.js, Axiom Prompts provides an intuitive platform for developers and AI enthusiasts to discover, create, and collaborate on prompt engineering.

## Overview

Axiom Prompts is designed to streamline prompt management with a comprehensive set of features including version control, community engagement through comments and stars, usage analytics, and a rich collection of pre-built prompts for various development tasks.

> [!TIP]
> The application comes with over 100 pre-built prompts covering everything from code generation to documentation, testing frameworks, and architectural patterns.

## Features

- **📝 Prompt Management**: Create, edit, and organize prompts with rich metadata
- **🔍 Advanced Search**: Filter prompts by tags, author, popularity, and usage
- **⭐ Community Features**: Star prompts, leave comments, and track popularity
- **📊 Analytics**: Usage tracking and statistics for prompt effectiveness
- **🔄 Version Control**: Track changes and maintain prompt history
- **🏷️ Tagging System**: Organize prompts with flexible tagging
- **📱 Responsive Design**: Modern UI built with Shadcn/ui and Tailwind CSS
- **🐳 Docker Support**: Easy deployment with Docker containers

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or Bun package manager
- Docker (optional, for containerized deployment)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd axiom-prompts
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start the frontend** (in a new terminal)
   ```bash
   cd fronth-end
   bun install
   bun run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Docker Deployment

For a quick deployment using Docker:

```bash
docker-compose up --build
```

This will start both frontend (port 8080) and backend (port 3000) services.

## Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeORM** - Database ORM
- **SQLite** - Database
- **TypeScript** - Type safety

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching
- **React Router** - Navigation
- **React Hook Form** - Form handling

## Development

### Project Structure

```
axiom-prompts/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── entity/         # TypeORM entities
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Express middleware
│   └── database.sqlite     # SQLite database
├── fronth-end/             # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── lib/           # Utilities and API client
└── prompts/               # Pre-built prompt collection
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run seed` - Seed database with sample data

**Frontend:**
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build

### API Endpoints

The backend provides a RESTful API with the following main endpoints:

- `GET /api/prompts` - List all prompts with filtering
- `GET /api/prompts/:id` - Get specific prompt details
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/:id` - Update existing prompt
- `DELETE /api/prompts/:id` - Delete prompt
- `POST /api/prompts/:id/star` - Toggle star status
- `GET /api/stats` - Get application statistics

## Deployment

### Environment Variables

Create `.env` files in both `backend/` and `fronth-end/` directories:

**Backend (.env):**
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000
```

### Production Build

1. **Build the backend:**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build the frontend:**
   ```bash
   cd fronth-end
   bun run build
   ```

The built frontend files will be in `fronth-end/dist/` and can be served by any static file server.

> [!NOTE]
> The application uses SQLite for simplicity, but can be easily configured to use other databases supported by TypeORM for production deployments.