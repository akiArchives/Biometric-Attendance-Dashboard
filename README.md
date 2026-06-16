# CLIFSA Biometric Attendance Dashboard

A real-time logging portal built with **Next.js 15 (App Router)** and **Supabase**, engineered to act as a cloud-native viewing console for an on-premise **HikCentral Access Control** deployment.

This application replaces legacy attendance exports with a live-updating, scannable control panel optimized for privileged accounts and managers for payroll management.

## Tech Stack

- **Framework:** Next.js (React 19, App Router)
- **Database:** Supabase (PostgreSQL) with Realtime Replication enabled
- **Styling:** Tailwind CSS using shadcn UI components
- **Icons:** Lucide React

## How It Works

1. **Data Interchange:** The local HikCentral Access Control server is configured to automatically dump raw biometric swipe records directly into the Supabase PostgreSQL instance via its background synchronization engine.
2. **Real-time Pipeline:** Supabase listens to `INSERT` database triggers and broadcasts changes immediately over WebSockets.
3. **Hydrated UI:** The Next.js dashboard uses Server Components to fetch initial historical states instantly, then passes the stream down to an interactive Client Component that seamlessly injects live logs without requiring a page refresh.

## Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/clifsa-biometric-dashboard.git](https://github.com/your-username/clifsa-biometric-dashboard.git)
cd clifsa-biometric-dashboard
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add the following variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
```

### 4. Run the development server
```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:3000 with your browser to see the dashboard.
