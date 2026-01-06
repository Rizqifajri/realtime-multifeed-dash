"use client"

import { Feed } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FeedTabsProps {
  selectedFeed: Feed
  onFeedChange: (feed: Feed) => void
  eventCounts: Record<Feed, number>
}

const FEED_LABELS: Record<Feed, string> = {
  [Feed.ALL]: "All",
  [Feed.NEWS]: "News Feed",
  [Feed.MARKET]: "Market Activity Feed",
  [Feed.PRICE]: "Price Movement",
}

export function FeedTabs({ selectedFeed, onFeedChange, eventCounts }: FeedTabsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {Object.values(Feed).map((feed) => (
        <button
          key={feed}
          onClick={() => onFeedChange(feed)}
          className={cn(
            "group relative flex items-center gap-2 px-4 py-2 text-[11px] tracking-widest transition-all",
            selectedFeed === feed
              ? "text-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5",
          )}
        >
          {/* Active indicator bar */}
          {selectedFeed === feed && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}

          <span className="relative">{FEED_LABELS[feed]}</span>

          {eventCounts[feed] > 0 && (
            <span
              className={cn(
                "text-[9px] opacity-70",
                selectedFeed === feed ? "text-primary" : "text-muted-foreground",
              )}
            >
              [{eventCounts[feed] > 99 ? "99+" : eventCounts[feed]}]
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
