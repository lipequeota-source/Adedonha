# Adedonha Neon

## Overview
Adedonha Neon is a modern, real-time multiplayer version of the classic game "Adedonha" (also known as Stop or Scattergories). Built to provide a rich, interactive experience, it uses a clean, Apple-inspired Glassmorphism UI and connects via Firebase Realtime Database for seamless synchronization.

## Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6 Modules)
- **Backend/DB**: Firebase Realtime Database, Firebase Anonymous Auth
- **Avatars**: DiceBear API (v9.x)
- **Design Pattern**: Glassmorphism (Apple-like aesthetics)

## Architecture & Guidelines
- **Styling**: Always use the defined CSS variables in `:root` (found in `style.css`) for colors, spacing, and radius to maintain visual consistency. Stick to the Glassmorphism approach (`.apple-card`). Avoid adding extra frameworks.
- **Typography**: The primary font is Inter (`'Inter', sans-serif`).
- **State Management**: The application state is managed locally and synced via Firebase. Maintain modular and decoupled functions in `script.js`. Avoid global state mutations where possible, except for the defined `state` and `currentUser` objects.
- **Realtime Sync**: Always ensure new features are thoroughly validated on the client side before synchronizing via Firebase. Handle edge cases like disconnections gracefully.

## Code Standards
- **Naming Conventions**: Use `camelCase` for variables and functions. DOM elements are grouped in the `DOM` object for easy access and maintainability.
- **Security**: Do not log or expose any Firebase credentials outside the already defined configuration block.
- **Avatar System**: The application uses `dicebear` for generating user avatars. Controls are dynamically shown/hidden based on the selected avatar style (e.g. `avataaars`). If changes are made, ensure they align with the latest `dicebear` schema.

## Professional Cohesion
- All updates must maintain a professional tone in both documentation and code comments.
- Keep the UI responsive and accessible.