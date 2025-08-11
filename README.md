# Tartr - Crypto Lending Platform

A modern, secure crypto lending platform that allows users to deposit cryptocurrency as collateral and borrow stablecoins instantly. Built with React, TypeScript, and thirdweb for seamless wallet integration.

## 🚀 Features

### Core Functionality
- **Multi-Wallet Support**: Connect with 15+ wallet providers including MetaMask, Coinbase, Rainbow, and social logins ( Done )
- **Instant Crypto Lending**: Deposit BTC, ETH as collateral to borrow USDC/USDT
- **Real-time Health Monitoring**: Track loan health factors and liquidation risks
- **Flexible Loan Terms**: Multiple loan tiers (Starter, Growth, Professional, Enterprise)
- **Non-Custodial**: Users maintain full control of their assets

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts

### Blockchain & Wallets
- **Wallet Integration**: Thirdweb SDK
- **Supported Wallets**: MetaMask, Coinbase, Rainbow, Social Logins (Google, Discord, etc.)
- **Networks**: Ethereum, Sepolia (Testnet)

### State Management & Routing
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation

### Development Tools
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Notifications**: Sonner Toast

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### Clone the Repository
```bash
git clone https://github.com/GurEtun/tartr-simple-borrow.git
cd tartr-simple-borrow
```

### Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup
Create a `.env` file in the root directory:

```env
# Thirdweb Configuration
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

```

### Get Thirdweb Client ID
1. Visit [thirdweb dashboard](https://thirdweb.com/dashboard)
2. Create a new project or use existing one
3. Copy your Client ID from the project settings
4. Add it to your `.env` file

## 🚀 Getting Started

### Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit `http://localhost:8080` to view the application.

### Build for Production
```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── platform/       # Platform-specific components
│   ├── Header.tsx      # App header with wallet connection
│   ├── Hero.tsx        # Landing page hero section
│   └── ...             # Other components
├── pages/              # Page components
│   ├── Index.tsx       # Landing page
│   ├── Platform.tsx    # Main platform dashboard
│   ├── LoanApplication.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useWalletBalance.tsx
│   └── use-mobile.tsx
├── lib/                # Utility libraries
│   ├── thirdweb.ts     # Thirdweb configuration
│   └── utils.ts        # General utilities
├── styles/             # CSS files
└── App.tsx             # Main app component
```


## 📚 Resources

- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
