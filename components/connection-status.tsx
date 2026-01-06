"use client"

import { Activity, WifiOff } from "lucide-react"
import type { ConnectionStatus as ConnectionStatusType } from "@/lib/types"

interface ConnectionStatusProps {
  status: ConnectionStatusType
  error?: string | null
  onReconnect?: () => void
}

export function ConnectionStatus({ status, error, onReconnect }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
      <div className="flex items-center gap-2">
        {status === "connected" && (
          <>
            <div className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-emerald-500">Connected</span>
          </>
        )}
        {status === "connecting" && (
          <>
            <Activity className="h-3 w-3 animate-pulse text-amber-500" />
            <span className="text-amber-500">Connecting...</span>
          </>
        )}
        {status === "disconnected" && (
          <>
            <WifiOff className="h-3 w-3 text-rose-500" />
            <span className="text-rose-500">Offline</span>
            {onReconnect && (
              <button
                onClick={onReconnect}
                className="ml-2 border border-rose-500/30 px-1.5 py-0.5 text-[9px] text-rose-500 hover:bg-rose-500/10"
              >
                Reconnect
              </button>
            )}
          </>
        )}
      </div>
      {error && <span className="text-muted-foreground opacity-50">[{error}]</span>}
    </div>
  )
}
