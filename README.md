# Real-Time Multifeed Dashboard

![Dashboard Preview](public/screenshoot.png) 
A high-performance, resilient real-time multifeed dashboard built with **Next.js** and **WebSockets**. Designed to handle high-frequency data streams with robust error handling, connection resilience, and UI performance optimizations.

## 🚀 Key Features

* **⚡ Real-Time Streaming:** Consumes live market, news, and price events via WebSocket.
* **🛡️ Connection Resilience:** Implements **Exponential Backoff** strategy to gracefully handle network jitters and auto-reconnect.
* **🧠 Intelligent State Management:** Uses **Zustand** with atomic updates and `useShallow` to prevent unnecessary re-renders.
* **🧹 Data Integrity:** Client-side **Deduplication** logic ensures no duplicate events are rendered.
* **🚀 Performance Optimized:** Implements a **Circular Buffer** (max 100 items) to prevent memory leaks during long sessions.
* **🧪 Chaos Engineering Ready:** The frontend is hardened to handle malformed JSON and "poison pill" data without crashing.

## 🛠 Tech Stack & Rationale

| Technology | Role | Why I Chose It |
| :--- | :--- | :--- |
| **Next.js** | Framework | Server-side rendering capabilities and App Router architecture. |
| **TypeScript** | Language | Strict typing ensures data contract reliability between Client & Server. |
| **Zustand** | State Manager | Chosen over Context API to avoid re-rendering the entire app on high-frequency updates. |
| **Tailwind CSS** | Styling | Rapid, consistent UI development with Dark Mode support. |
| **Node.js (ws)** | Mock Server | Custom WebSocket server to simulate production traffic and anomalies. |

## 🏗 Architecture Overview

The application follows **Clean Architecture** principles to separate concerns:

### 1. Data Layer (`src/store/`)
Managed by **Zustand**. Acts as the Single Source of Truth.
* **Business Logic:** Handles deduplication (ID checking) and buffer limits (FIFO).
* **Computed Values:** Derives filtered lists and statistics dynamically.

### 2. Connection Layer (`src/hooks/`)
Encapsulated in `useWebSocket` custom hook.
* **Resilience:** Automatically attempts to reconnect with increasing delays (`1s`, `2s`, `4s`...) if the connection drops.
* **Safety:** Wraps message parsing in `try-catch` blocks to silently handle errors.

### 3. UI Layer (`src/components/`)
* **Optimization:** Components subscribe only to specific slices of state using `useShallow`, ensuring high performance even when data updates 10x/second.
* **Design:** Uses a "Bento Grid" layout for clear data visualization.

## 🧪 Simulation & Chaos Testing

To verify robustness, the included **Mock Server** (`server/index.ts`) simulates a real-world environment by:
1.  **Streaming Data:** Sends random events every 1.5 seconds.
2.  **Chaos Injection:** Randomly (10% chance) sends **Malformed JSON** or **Corrupted Data** to test the frontend's error boundaries.

> *The dashboard successfully catches these errors in the background without interrupting the user experience.*

## 🏃‍♂️ Getting Started

### Prerequisites
* Node.js 18+
* npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Rizqifajri/realtime-multifeed-dash.git](https://github.com/Rizqifajri/realtime-multifeed-dash.git)
    cd realtime-multifeed-dash
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the Mock Server (Terminal 1)**
    *Runs on ws://localhost:8080*
    ```bash
    npm run mock-server 
    ```
    or
    ```bash
    npm tsx server/index.ts
    ```

4.  **Start the Frontend (Terminal 2)**
    *Runs on http://localhost:3000*
    ```bash
    npm run dev
    ```

5.  **Open Dashboard**
    Navigate to `http://localhost:3000/feed`

## 📂 Project Structure

```bash
src/
├── app/
│   └── feed/           # Page Controller (View Layer)
├── components/         # UI Components (Presentational)
├── hooks/              # Custom Hooks (Connection Logic)
├── lib/                # Types & Utilities
├── store/              # Zustand Store (Business Logic)
└── server/             # WebSocket Mock Server