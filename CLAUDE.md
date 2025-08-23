# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a Phoenix/Elixir web application called "Agora" that uses Inertia.js with React for the frontend. The application appears to be focused on data analysis and sustainability reporting, particularly for related projects.

### Key Technologies
- **Backend**: Phoenix 1.7.18, Elixir (~> 1.14)
- **Frontend**: React 19.1.1 with Inertia.js 2.x for SPA-like behavior
- **Database**: PostgreSQL with Ecto
- **Styling**: Tailwind CSS
- **Build Tools**: esbuild for JavaScript bundling, Tailwind for CSS

### Architecture Pattern
- **Phoenix + Inertia.js**: Controllers render React components via Inertia instead of traditional Phoenix templates
- **SPA-like behavior**: Client-side routing and state management through Inertia.js
- **Asset Pipeline**: esbuild handles JSX compilation and bundling

## Common Development Commands

### Setup and Dependencies
```bash
mix setup                    # Install and setup all dependencies
mix deps.get                # Get Elixir dependencies only
mix ecto.setup              # Setup database (create, migrate, seed)
mix ecto.reset              # Drop and recreate database
```

### Development Server
```bash
mix phx.server              # Start Phoenix server
iex -S mix phx.server       # Start with IEx shell
```

### Database Operations
```bash
mix ecto.create             # Create database
mix ecto.migrate            # Run migrations
mix ecto.rollback           # Rollback last migration
```

### Asset Management
```bash
mix assets.setup            # Install frontend dependencies (Tailwind, esbuild)
mix assets.build            # Build assets for development
mix assets.deploy           # Build and optimize assets for production
```

### Testing
```bash
mix test                    # Run all tests
mix test --failed           # Run only failed tests
```

### Frontend Development
The frontend assets are in `/assets/` directory:
- `/assets/js/app.jsx` - Main JavaScript entry point
- `/assets/js/pages/` - React page components
- `/assets/css/app.css` - Tailwind CSS styles

## Code Structure

### Backend (Phoenix/Elixir)
- `lib/agora_web/controllers/` - HTTP controllers that render Inertia components
- `lib/agora_web/` - Web layer configuration and shared modules
- `lib/agora/` - Core business logic and contexts
- Controllers use `render_inertia/1` instead of traditional Phoenix templates

### Frontend (React/Inertia.js)
- `assets/js/pages/` - React components that serve as "pages"
- Page components receive props from Phoenix controllers
- Use `@inertiajs/react` Link component for navigation
- Styled with Tailwind CSS classes

### Key Files
- `lib/agora_web/router.ex` - Route definitions
- `lib/agora_web.ex` - Web module macros and imports
- `config/config.exs` - Application configuration including Inertia and asset pipeline
- `mix.exs` - Project dependencies and aliases

## Inertia.js Integration

Controllers should:
- Use `render_inertia/2` to render React components
- Pass data as props to frontend components
- Handle form submissions and return appropriate responses

Frontend components should:
- Import from `@inertiajs/react` for navigation and forms
- Use TypeScript interfaces for prop typing
- Follow React best practices for state management

## Development Notes

- The application uses Korean text and appears focused on sustainability/SDG reporting
- The build process compiles JSX to ES modules with code splitting
- Live reload is configured for development
