# PMAJAY Frontend

## Overview
This is a React + Vite frontend application for a MERN (MongoDB, Express, React, Node.js) Role-Based Access Control (RBAC) system. The application manages the Pradhan Mantri Adarsh Gram Yojana (PM-AJAY) government scheme with different dashboards for officers, collectors, and the prime minister.

## Project Structure
- **Framework**: React 18 with Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom government color palette
- **Maps**: Leaflet + React Leaflet
- **HTTP Client**: Axios
- **Backend**: External API hosted at https://backendpmajay.onrender.com

### Directory Structure
```
src/
├── components/
│   └── layout/
│       ├── Header.jsx         # Main header with government branding
│       ├── Sidebar.jsx        # Collapsible navigation sidebar
│       └── DashboardLayout.jsx # Wrapper combining Header + Sidebar
├── config/
│   └── navigation.js          # Centralized navigation configuration
├── pages/
│   ├── Home.jsx              # Landing page with government portal styling
│   ├── Login.jsx             # Two-column login with feature highlights
│   ├── OfficerDashboard.jsx  # Officer role dashboard
│   └── CollectorDashboard.jsx # Collector role dashboard
└── index.css                  # Global styles with Inter font
```

## Design System
The UI follows an official Indian government portal aesthetic with:
- **Primary Color**: Dark green (#166534 - gov-green-700)
- **Accent Colors**: Saffron (#F97316), Orange (#EA580C), Ashoka Blue (#00008B)
- **Typography**: Inter font family
- **Government Elements**: Ashoka Chakra emblem, Hindi/English bilingual headers
- **Layout**: Collapsible sidebar navigation, unified header across dashboards

### Custom Tailwind Colors
- `gov-green`: 50-950 shades for primary government branding
- `gov-orange`: Accent color for highlights and CTAs
- `gov-saffron`: Traditional Indian tri-color representation

## Setup Information
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (required for Replit proxy)
- **Dev Server**: Vite with HMR enabled
- **Allowed Hosts**: .replit.dev, .repl.co (for Replit proxy support)

## Key Features
- Role-based authentication and authorization
- Document submission and review workflows
- Geospatial mapping for project visualization
- Work package management
- Multi-level verification system (Officer → Collector → Prime Minister)
- Professional government portal UI design

## User Roles
1. **Officer** (Block/District Officer) - Submit and review documents
2. **Collector** - Review officer submissions and verify work packages
3. **Prime Minister** - High-level dashboard and oversight

## Recent Changes (December 8, 2025)
### UI Redesign
- Redesigned entire UI to match official government portal aesthetic
- Created reusable layout components (Header, Sidebar, DashboardLayout)
- Implemented dark green color scheme with saffron/orange accents
- Updated Home page with government branding, news section, and feature highlights
- Redesigned Login page with two-column layout and feature showcase
- Integrated new layout into Officer and Collector dashboards
- Added centralized navigation configuration in src/config/navigation.js
- Added Inter font and custom scrollbar styling

### Technical Setup
- Configured Vite to run on port 5000 with host 0.0.0.0 for Replit compatibility
- Added allowedHosts configuration for Replit proxy
- Updated .gitignore with standard Node.js patterns
- Installed all npm dependencies
- Configured workflow for automatic startup

## Backend Integration
The frontend connects to an external backend API:
- Base URL: https://backendpmajay.onrender.com
- API proxy configured in vite.config.js for `/api` routes
- JWT token authentication via localStorage
- Automatic token attachment via Axios interceptors

## Contributing
This is a UI-only redesign for PR contribution. All core business logic, API calls, and authentication flows remain unchanged.
