"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Message } from "@/types/chat"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Bot } from "lucide-react"

interface ChatMessageProps {
  message: Message
  isOwn: boolean
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const isSystem = message.type === "system"

  if (isSystem) {
    return (
      <div className="flex items-center justify-center py-2">
        <Badge variant="secondary" className="text-xs">
          <Bot className="w-3 h-3 mr-1" />
          {message.content}
        </Badge>
      </div>
    )
  }

  return (
    <div className={`flex items-start space-x-3 ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
      <Avatar className="w-8 h-8">
        <AvatarFallback className={`text-xs ${isOwn ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          {message.user.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 max-w-xs lg:max-w-md ${isOwn ? "text-right" : ""}`}>
        <div className="flex items-center space-x-2 mb-1">
          <span className={`text-sm font-medium ${isOwn ? "text-blue-600" : "text-gray-900"}`}>
            {isOwn ? "Você" : message.user}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(message.timestamp, {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>

        <div
          className={`
          inline-block px-3 py-2 rounded-2xl text-sm
          ${isOwn ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-100 text-gray-900"}
        `}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}
