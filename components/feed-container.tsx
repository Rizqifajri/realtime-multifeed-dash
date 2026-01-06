"use client"

import { useEffect, useRef, useState } from "react"
import type { BaseEvent } from "@/lib/types"
import { FeedItem } from "./feed-item"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface FeedContainerProps {
  events: BaseEvent[]
  isConnected: boolean
}

export function FeedContainer({ events, isConnected }: FeedContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const prevEventsLengthRef = useRef(events.length)

  useEffect(() => {
    if (!containerRef.current || !autoScroll) return

    // Only auto-scroll if new events were added
    if (events.length > prevEventsLengthRef.current) {
      const container = containerRef.current
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100

      if (isNearBottom) {
        container.scrollTo({ top: 0, behavior: "smooth" })
      }
    }

    prevEventsLengthRef.current = events.length
  }, [events, autoScroll])

  const handleScroll = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const isNearTop = container.scrollTop < 100

    setAutoScroll(isNearTop)
  }

  if (events.length === 0) {
    return (
      <Card className="flex min-h-96 flex-col items-center justify-center p-12">
        {isConnected ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Waiting for events...</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No connection to feed</p>
        )}
      </Card>
    )
  }

  return (
    <div className="relative">
      {!autoScroll && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2">
          <button
            onClick={() => {
              containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
              setAutoScroll(true)
            }}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-lg hover:bg-accent"
          >
            New events available
          </button>
        </div>
      )}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex max-h-[calc(100vh-20rem)] flex-col gap-3 overflow-y-auto pr-2"
      >
        {events.map((event) => (
          <FeedItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
