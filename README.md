# CompanionX 🚌

> **India's identity-vetted bus travel companion network — find verified co-travelers, split fares, and ride safe.**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](./LICENSE)
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## ✨ What is CompanionX?

**CompanionX** is a web application that connects bus travelers across major Indian cities. It lets you book a bus seat and find a government-ID-verified co-traveler to share the journey and split the fare — saving up to **40% on travel costs** while keeping safety at the forefront.

Every user on the platform is required to complete a biometric government ID verification (Aadhaar / Passport / PAN), ensuring that no anonymous faces board your bus.

---

## 🚀 Features

### 🔐 Identity Verification & Authentication
- Multi-step onboarding gate before accessing the platform
- Login via **Google / Gmail OAuth** (simulated) or **mobile OTP**
- Government ID verification — Aadhaar, Passport, or PAN card upload
- Simulated biometric scanning with real-time progress feedback
- Guest / Explore mode (skip verification to browse the platform)

### 🗺️ Smart Trip Search
- **Inter-city** and **Intra-city** bus search modes
- City picker with live search across 15+ major Indian cities (Delhi, Mumbai, Bangalore, Goa, and more)
- Date selection for journey planning
- Passenger count selector

### 💺 Seat Selection
- Interactive seat map for both inter-city and intra-city bus layouts
- Visual distinction between available, booked, and selected seats
- Auto-selection of adjacent seats for 2-passenger bookings
- Seat-specific companion matching

### 💰 Fare Splitting ("Save Money Mode")
- Toggle between solo and shared fare modes
- Automatic fare calculation and splitting between co-travelers
- Transparent pricing with no hidden costs

### 🛡️ Safety-First Design
- AES-256 encrypted government biometric verification pipeline
- Zero-friction verified co-traveler credentials display
- Active distress safety protocols

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v3 + shadcn/ui |
| UI Components | Radix UI (40+ primitives) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animations | GSAP + tailwindcss-animate |
| Icons | Lucide React |
| Notifications | Sonner |
| Deployment | Vercel / Netlify |

---

## 📂 Project Structure

```
CompanionX/
├── app/                        # Main React application
│   ├── src/
│   │   ├── App.tsx             # Root component (all pages & flows)
│   │   ├── App.css             # App-specific styles
│   │   ├── index.css           # Global styles & CSS variables
│   │   ├── main.tsx            # Application entry point
│   │   ├── components/         # Reusable UI components (shadcn/ui)
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utility functions
│   ├── public/                 # Static assets
│   ├── index.html              # HTML entry point
│   ├── tailwind.config.js      # Tailwind theme configuration
│   ├── vite.config.ts          # Vite build configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # App dependencies
├── package.json                # Root scripts (proxies to app/)
├── vercel.json                 # Vercel deployment config
├── netlify.toml                # Netlify deployment config
└── LICENSE                     # ISC License
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Avineesh-G/CompanionX.git
cd CompanionX

# Install root dependencies
npm install

# Install app dependencies
cd app && npm install && cd ..
```

### Development

```bash
# Start the dev server (from the root)
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The production build will be output to `app/dist/`.

### Preview Production Build

```bash
npm run preview
```

---

## 🌐 Deployment

CompanionX is configured for seamless deployment on both **Vercel** and **Netlify**.

### Deploy to Vercel

The [`vercel.json`](./vercel.json) is pre-configured:

```json
{
  "buildCommand": "cd app && npm install && npm run build",
  "outputDirectory": "app/dist",
  "framework": "vite"
}
```

Just connect your GitHub repo to [Vercel](https://vercel.com) and it will deploy automatically.

### Deploy to Netlify

The [`netlify.toml`](./netlify.toml) is pre-configured:

```toml
[build]
  base    = "app"
  publish = "dist"
  command = "npm run build"
```

Just connect your GitHub repo to [Netlify](https://netlify.com) and it will deploy automatically.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Avineesh G**
- GitHub: [@Avineesh-G](https://github.com/Avineesh-G)
- Repo: [github.com/Avineesh-G/CompanionX](https://github.com/Avineesh-G/CompanionX)
