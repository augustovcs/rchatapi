"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/contexts/chat-context"
import { Hash, Lock } from "lucide-react"

export function RoomsList() {
  const { rooms, currentRoom, joinRoom, messages } = useChat()

  const getRoomMessageCount = (roomId: string) => {
    return messages.filter((msg) => msg.room === roomId).length
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Salas de Chat</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {rooms.map((room) => {
            const isActive = room.id === currentRoom
            const messageCount = getRoomMessageCount(room.id)

            return (
              <Button
                key={room.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${isActive ? "bg-blue-50 border-blue-200" : ""}`}
                onClick={() => joinRoom(room.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div
                    className={`
                    w-6 h-6 rounded flex items-center justify-center
                    ${isActive ? "bg-blue-600" : "bg-gray-200"}
                  `}
                  >
                    {room.isPrivate ? (
                      <Lock className={`w-3 h-3 ${isActive ? "text-white" : "text-gray-600"}`} />
                    ) : (
                      <Hash className={`w-3 h-3 ${isActive ? "text-white" : "text-gray-600"}`} />
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{room.name}</span>
                      {messageCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {messageCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{room.description}</p>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
