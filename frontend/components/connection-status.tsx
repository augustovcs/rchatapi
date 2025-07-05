"use client"

import { Badge } from "@/components/ui/badge"
import { useChat } from "@/contexts/chat-context"
import { Wifi, WifiOff, Loader2 } from "lucide-react"

export function ConnectionStatus() {
  const { connectionState } = useChat()

  if (connectionState.isConnecting) {
    return (
      <Badge variant="secondary" className="text-xs">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        Conectando...
      </Badge>
    )
  }

  if (connectionState.isConnected) {
    return (
      <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
        <Wifi className="w-3 h-3 mr-1" />
        Online
      </Badge>
    )
  }

  return (
    <Badge variant="destructive" className="text-xs">
      <WifiOff className="w-3 h-3 mr-1" />
      Offline
    </Badge>
  )
}
