[← Back to Main](../README.md)

# Klair Frontend

The Klair frontend is a modern, real-time dashboard built with **Next.js 16** and **React 19** that interfaces with the Klair AI engine to monitor live streams, generate viral clips, and manage content distribution.

## 🚀 Technology Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **UI Library**: [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Backend/Auth**: [Supabase](https://supabase.com/)
-   **State Management**: React Hooks & Context

## 🛠️ Getting Started

### Prerequisites

-   Node.js 18+ installed
-   A running instance of the Klair Backend (Python/FastAPI)
-   Supabase project credentials

### Installation

1.  **Clone the repository** (if not already done):
    ```bash
    git clone https://github.com/your-repo/klair.git
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file in the root of the `frontend` directory with your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

### Running Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

The project follows a standard Next.js App Router structure:

-   **`app/`**: Contains the main application routes, layouts, and page logic.
    -   `page.tsx`: The main dashboard view.
    -   `layout.tsx`: Global layout and font configuration.
    -   `globals.css`: Global styles and Tailwind imports.
-   **`app/services/`**: API and WebSocket integration layers.
    -   `clipService.ts`: Handles HTTP requests to the backend and WebSocket connections for real-time logs.
-   **`app/types/`**: TypeScript interfaces for data models (Clips, Logs, Engine Status).
-   **`components/`**: Reusable UI components.
    -   `dashboard/`: Components specific to the dashboard (Header, Logs, Gallery).
    -   `inspector/`: Video player and detailed clip view.
    -   `ui/`: Generic UI elements (Buttons, Modals, Toast).
-   **`hooks/`**: Custom React hooks for logic encapsulation.
    -   `useClipEngine.ts`: Core hook managing the AI engine state, polling, and WebSocket events.
    -   `useStreamControls.ts`: Manages stream input state (URL vs Platform/Username).
-   **`lib/`**: Library configurations (e.g., Supabase client).
-   **`utils/`**: Helper functions for time formatting, scoring, etc.

## ✨ Key Features

### 1. Real-time Dashboard
The dashboard (`app/page.tsx`) provides a unified view of the system's status. It features:
-   **Live System Logs**: scrollable terminal-like view of backend events.
-   **Stream Controls**: Start/Stop the AI engine on specific YouTube/Twitch streams.
-   **Status Indicator**: Visual feedback on whether the engine is running.

### 2. AI Clip Generation
-   **Supabase Realtime Sync**: The frontend uses WebSockets to instantly update as clips move from `processing` to `ready` or `partial`, requiring zero manual polling.
-   **Viral Score Grouping**: Clips are automatically organized into "Viral Hits", "Trending", or grouped by platform/creator based on their AI score.
-   **Needs Retry State**: If backend APIs fail, clips degrade gracefully into an amber "Needs Retry" UI section, where users can click to resume processing without losing the raw footage.

### 3. Inspector Mode
Clicking a clip opens the **Inspector**, allowing users to:
-   Watch the generated video clip.
-   View detailed metadata (transcript, reason for selection, score).
-   Edit clip details before publishing.

### 4. Demo Mode
If no backend is connected or no user is logged in, the application falls back to a **Demo Mode**, utilizing sample data from `data/demoData.ts` to showcase the UI capabilities without requiring a live server.

## 🔌 API Integration

The frontend communicates with the Python backend via:

-   **REST API**: For commands (Start/Stop), retrying failed clips, and managing configuration.
-   **Supabase Realtime**: For instant synchronization of newly generated clip states across clients.
-   **WebSocket**: For streaming raw text logs from the processing engine to the frontend UI dashboard.

Configuration for API endpoints is handled in `utils/clipHelpers.ts`.

## 🎨 Design System

The UI implements a "Liquid Glass" aesthetic using:
-   Dark mode by default with deep gradients.
-   Translucent backdrops with blur effects.
-   Neon accents for active states and high-viral scores.
