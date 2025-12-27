# Telegram Mini App - To-Do List

## Project Overview
This is a Telegram Mini App (TWA - Telegram Web App) that provides a To-Do List functionality inside Telegram.

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript
- Telegram WebApp SDK

## Project Structure
```
miniapp/
├── index.html      # Main HTML file
├── css/
│   └── styles.css  # Styles
├── js/
│   └── app.js      # Main application logic
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## Development Guidelines
- Use Telegram WebApp SDK for native Telegram integration
- Support both light and dark themes from Telegram
- Make the app responsive for all screen sizes
- Store tasks in localStorage for persistence

## Telegram WebApp Integration
- Initialize with `Telegram.WebApp.ready()`
- Use `Telegram.WebApp.MainButton` for primary actions
- Respect Telegram's color scheme via `Telegram.WebApp.themeParams`
