"use client"

import { Search, Terminal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ConnectionStatus } from "./connection-status"
import type { ConnectionStatus as ConnectionStatusType } from "@/lib/types"
import { ThemeToggle } from "./theme-toggle"

interface FeedHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  connectionStatus: ConnectionStatusType
  connectionError?: string | null
  onReconnect?: () => void
}

export function FeedHeader({
  searchQuery,
  onSearchChange,
  connectionStatus,
  connectionError,
  onReconnect,
}: FeedHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ConnectionStatus status={connectionStatus} error={connectionError} onReconnect={onReconnect} />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-sm border-border bg-card/50 pl-9 text-xs tracking-tight sm:w-64 focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>
      <ThemeToggle />
    </div>
  )
}
