# Hyper Garage KHI — Desktop App

A Karachi automotive hub as a cross-platform desktop app (Electron): garage directory, OBD-II code lookup, mechanic chat, service booking, parts store with cart, and a fuel cost calculator.

## Features
- Responsive layout: sidebar on desktop, bottom navigation on tablets and phones (window can be resized down to 360 px)
- Modern CSS only, no Tailwind or any CSS framework: custom properties, `@layer`, CSS grid, container queries, `clamp()` fluid type, `color-mix()`, `backdrop-filter`, `prefers-reduced-motion`
- Cart saved between launches (localStorage)
- Secure Electron setup: context isolation, no Node in the page, Content-Security-Policy, external links open in your browser

## Project structure
```
hyper-garage-khi/
├── package.json
├── main.js              Electron main process
├── README.md
└── src/
    ├── index.html
    ├── css/styles.css
    └── js/app.js        data + UI logic
```

## Run it
1. Install Node.js 18 or newer: https://nodejs.org
2. In this folder:
   ```bash
   npm install
   npm start
   ```

## Build an installer
```bash
npm run dist:win     # Windows .exe installer (build on Windows)
npm run dist:mac     # macOS .dmg (build on a Mac)
npm run dist:linux   # Linux AppImage
```
Output goes to the `dist/` folder. To use a custom icon, add a `build/icon.png` (512×512) or `build/icon.ico`.

## Customize
- Garages, services, products, OBD codes: edit the arrays at the top of `src/js/app.js`
- Colors, spacing, type scale: edit the variables in `:root` in `src/css/styles.css`

## Notes
- Fuel prices, car health values and mechanic chat replies are demo data. Replace them with a real API or backend before production use.
- Photos and icons load from Unsplash and the FontAwesome CDN, so an internet connection is needed to see them. For fully offline use, download them into a `src/assets` folder and update the paths.
- Checkout and booking are simulated; nothing is sent to a server.
