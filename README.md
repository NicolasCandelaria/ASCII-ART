# Number ASCII Art

Crazy browser based side project that turns uploaded images into number-based ASCII artwork. Built with Next.js, React, TypeScript, and Tailwind CSS. No backend;

## Features

- **Upload or drag-and-drop** images
- **Live preview** with adjustable output width and contrast
- **Presets**: Brutal, Ghost, Infrared, Ledger, Neon, Archive
- **Monochrome or colorized** output
- **Custom digit sets** (e.g. `9876543210`, `986531`, `86420`)
- **Invert** and **contrast** controls
- **Copy text** and **Download PNG** export

## Run locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Tech stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Browser Canvas API (client-side only)
