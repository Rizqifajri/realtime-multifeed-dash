export enum Feed {
  ALL = "all",
  NEWS = "news",
  MARKET = "market",
  PRICE = "price",
}

export interface BaseEvent {
  id: string
  feed: Feed
  ts: number
  title: string
  body?: string
}

export type ConnectionStatus = "connected" | "connecting" | "disconnected"

export interface WebSocketMessage {
  type: "event" | "ping" | "error"
  data?: BaseEvent
  error?: string
}
