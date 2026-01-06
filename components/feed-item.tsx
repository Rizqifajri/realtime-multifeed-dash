"use client"

import { memo } from "react"
import type { BaseEvent, Feed } from "@/lib/types"
import { Clock } from "lucide-react"

interface FeedItemProps {
  event: BaseEvent
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)

  if (diffSecs < 60) return `${diffSecs}s ago`
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`

  return date.toLocaleString()
}

function getFeedColor(feed: Feed): string {
  switch (feed) {
    case "news":
      return "text-blue-400 border-blue-400/30 bg-blue-400/5"
    case "market":
      return "text-emerald-400 border-emerald-400/30 bg-emerald-400/5"
    case "price":
      return "text-purple-400 border-purple-400/30 bg-purple-400/5"
    default:
      return "text-muted-foreground border-border bg-muted/5"
  }
}

const FeedItemComponent = ({ event }: FeedItemProps) => {
  return (
    <div className="group border-b border-border/50 bg-card/30 p-3 transition-colors hover:bg-accent/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border rounded ${getFeedColor(event.feed)}`}
            >
              {event.feed}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTimestamp(event.ts)}</span>
            </div>
          </div>
          <h3 className="truncate text-sm font-medium tracking-tight text-foreground group-hover:text-primary">
            {event.title}
          </h3>
          {event.body && (
            <p className="line-clamp-1 text-xs text-muted-foreground font-sans leading-normal">{event.body}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export const FeedItem = memo(FeedItemComponent, (prev, next) => {
  return prev.event.id === next.event.id
})

FeedItem.displayName = "FeedItem"
