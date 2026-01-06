"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { BaseEvent, ConnectionStatus } from "@/lib/types"

interface UseWebSocketOptions {
  onEvent: (event: BaseEvent) => void
  url: string
  maxReconnectDelay?: number
  initialReconnectDelay?: number
}

export function useWebSocket({
  onEvent,
  url,
  maxReconnectDelay = 30000,
  initialReconnectDelay = 1000,
}: UseWebSocketOptions) {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected")
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectDelayRef = useRef(initialReconnectDelay)
  const mountedRef = useRef(true)
  const onEventRef = useRef(onEvent)
  const urlRef = useRef(url)

  useEffect(() => {
    onEventRef.current = onEvent
    urlRef.current = url
  }, [onEvent, url])

  const cleanup = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.onclose = null 
      socketRef.current.close()
      socketRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!mountedRef.current) return

    cleanup()
    setStatus("connecting")
    setError(null)

    try {
      const socket = new WebSocket(urlRef.current)
      socketRef.current = socket

      socket.onopen = () => {
        if (!mountedRef.current) return
        console.log("[WS] Connected")
        setStatus("connected")
        reconnectDelayRef.current = initialReconnectDelay // Reset backoff
      }

      socket.onmessage = (e) => {
        if (!mountedRef.current) return
        try {
          const data = JSON.parse(e.data)
          if (data && typeof data === 'object') {
             onEventRef.current(data as BaseEvent)
          }
        } catch (err) {
          console.error("[WS] Parse Error:", err)
        }
      }

      socket.onclose = () => {
        if (!mountedRef.current) return
        
      //check if the socket that is closing is the active socket (handle race condition)
        if (socketRef.current === socket) {
          setStatus("disconnected")
          console.log(`[WS] Disconnected. Retrying in ${reconnectDelayRef.current}ms`)

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, maxReconnectDelay)
            connect()
          }, reconnectDelayRef.current)
        }
      }

      socket.onerror = (e) => {
        console.error("[WS] Error:", e)
        if (mountedRef.current) setError("WebSocket connection error")
      }

    } catch (err) {
      console.error("[WS] Connection Failed:", err)
      if (mountedRef.current) {
        setStatus("disconnected")
        setError("Failed to initialize connection")
      }
    }
  }, [cleanup, initialReconnectDelay, maxReconnectDelay])

  //initial connect & reconnect when url changes
  useEffect(() => {
    mountedRef.current = true
    connect()

    return () => {
      mountedRef.current = false
      cleanup()
    }
  }, [connect, cleanup, url]) //url is added to the dependency array so that the auto-reconnect works when the url changes

  return { status, error, reconnect: connect }
}