# Portfolio website

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nahuelgamail-1582s-projects/v0-portfolio-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/gGwCuQZkgnf)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/nahuelgamail-1582s-projects/v0-portfolio-website](https://vercel.com/nahuelgamail-1582s-projects/v0-portfolio-website)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/gGwCuQZkgnf](https://v0.app/chat/gGwCuQZkgnf)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Local development (official)

### Requirements

- Node.js `22.x` (LTS)
- npm `10.x` or `11.x`

### Quickstart

```bash
npm i
npm run dev
```

### Useful commands

```bash
npm run lint
npm run build
```

## Windows EPERM recovery

If you hit errors like `spawn EPERM` or `EPERM: operation not permitted, unlink ...`, run:

```powershell
# 1) Close stale Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2) Remove Next cache/build output
if (Test-Path .next) { Remove-Item -LiteralPath .next -Recurse -Force }

# 3) Reinstall and retry
npm i
npm run dev
```

If the error persists:

- Check Windows Defender / Controlled Folder Access and allow `node.exe` and your project folder.
- If you use Volta, pin Node 22 for this project and open a fresh terminal.
