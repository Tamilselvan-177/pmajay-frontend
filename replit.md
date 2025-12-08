# PMAJAY Frontend

## Overview
This is a React + Vite frontend application for a MERN (MongoDB, Express, React, Node.js) Role-Based Access Control (RBAC) system. The application manages a government project verification system with different dashboards for officers, collectors, and the prime minister.

## Project Structure
- **Framework**: React 18 with Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + React Leaflet
- **HTTP Client**: Axios
- **Backend**: External API hosted at https://backendpmajay.onrender.com

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

## User Roles
1. **Officer** (Block/District Officer) - Submit and review documents
2. **Collector** - Review officer submissions and verify work packages
3. **Prime Minister** - High-level dashboard and oversight

## Recent Changes (December 8, 2024)
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
