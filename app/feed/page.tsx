"use client"

import { useState } from "react"
import { useWebSocket } from "@/hooks/use-websocket"
import { useFeedStore } from "@/store/use-feed-store"
import { Feed } from "@/lib/types"

// Components
import { FeedHeader } from "@/components/feed-header"
import { FeedTabs } from "@/components/feed-tabs"
import { FeedContainer } from "@/components/feed-container"
import { EmptyState } from "@/components/empty-state"
import { LayoutDashboard, Globe, Activity, Database } from "lucide-react"

// Penting: Import useShallow untuk mencegah re-render loop
import { useShallow } from 'zustand/react/shallow'

export default function FeedPage() {
  const [selectedFeed, setSelectedFeed] = useState<Feed>(Feed.ALL)
  const [searchQuery, setSearchQuery] = useState("")

  // --- ZUSTAND SELECTORS (Optimized) ---
  const addEvent = useFeedStore((state) => state.addEvent)

  // Gunakan useShallow untuk object/array hasil komputasi
  const eventCounts = useFeedStore(
    useShallow((state) => state.getEventCounts())
  )

  const filteredEvents = useFeedStore(
    useShallow((state) => state.getFilteredEvents(selectedFeed, searchQuery))
  )

  // Primitive value (number) aman tanpa useShallow
  const totalEvents = useFeedStore((state) => state.events.length)

  // --- WEBSOCKET ---
  const { status, error, reconnect } = useWebSocket({
    onEvent: addEvent,
    url: "ws://localhost:8080"
  })

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <span className="text-xl font-bold tracking-tight text-foreground">Dashboard</span>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
          <NavItem icon={<Globe size={18} />} label="Global Feed" />
          <NavItem icon={<Activity size={18} />} label="Activity" />
          <NavItem icon={<Database size={18} />} label="Archives" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-card/80 backdrop-blur-xl z-10">
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-foreground">Multi-Feed Dashboard</h2>
            <p className="text-xs text-muted-foreground">
              made by <a href="https://github.com/Rizqifajri" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Rizqifajri</a>
            </p>
          </div>

          <FeedHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            connectionStatus={status}
            connectionError={error}
            onReconnect={reconnect}
          />
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 flex flex-col gap-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Stream" value={totalEvents} sub="Events tracked" color="text-blue-500" />
            <StatCard title="News Feed" value={eventCounts[Feed.NEWS]} sub="Latest updates" color="text-amber-500" />
            <StatCard title="Market Activity" value={eventCounts[Feed.MARKET]} sub="Transactions" color="text-cyan-500" />
            <StatCard title="Price Ticks" value={eventCounts[Feed.PRICE]} sub="Volatility" color="text-emerald-500" />
          </div>

          {/* Feed Container */}
          <div className="flex-1 flex flex-col min-h-[500px] bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border bg-card/50 flex items-center justify-between">
              <FeedTabs
                selectedFeed={selectedFeed}
                onFeedChange={setSelectedFeed}
                eventCounts={eventCounts}
              />
            </div>

            <div className="flex-1 overflow-hidden relative">
              {filteredEvents.length === 0 && totalEvents > 0 ? (
                <EmptyState message="No results matching your filter" />
              ) : (
                <FeedContainer events={filteredEvents} isConnected={status === "connected"} />
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="h-10 bg-card border-t border-border px-6 flex items-center justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'connected' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
            <span>System Status: {status}</span>
          </div>
          <div className="flex gap-6">
            <span>Buffer Limit: 100</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

// --- Sub Components ---

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
      active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  )
}

function StatCard({ title, value, sub, color }: { title: string, value: number, sub: string, color: string }) {
  return (
    <div className="bg-card border border-border p-5 rounded-2xl hover:border-primary/50 transition-colors group">
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        {/* Menggunakan toLocaleString() agar angka ribuan ada komanya (1,000) */}
        <span className={`text-3xl font-bold tracking-tight ${color}`}>{value.toLocaleString()}</span>
        <span className="text-[10px] text-muted-foreground font-medium opacity-70">{sub}</span>
      </div>
      {/* Decorative Bar */}
      <div className="mt-4 h-1 w-full bg-secondary/50 rounded-full overflow-hidden">
        <div className={`h-full bg-current ${color} opacity-40 w-2/3 group-hover:w-full transition-all duration-700 ease-out`} />
      </div>
    </div>
  )
}