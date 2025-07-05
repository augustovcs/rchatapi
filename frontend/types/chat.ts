export interface Message {
  id: string
  user: string
  content: string
  timestamp: Date
  room: string
  type: "text" | "system" | "emoji"
}

export interface User {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
}

export interface ChatRoom {
  id: string
  name: string
  description: string
  userCount: number
  isPrivate: boolean
}

export interface ConnectionState {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}
