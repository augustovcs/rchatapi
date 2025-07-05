"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/contexts/chat-context"
import { Users, Circle } from "lucide-react"

export function UsersList() {
  const { users, currentUser } = useChat()

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Usuários Online ({users.length})</h3>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-gray-200">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Circle className="absolute -bottom-1 -right-1 w-3 h-3 text-green-500 fill-current" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 truncate">{user.name}</span>
                  {user.id === currentUser?.id && (
                    <Badge variant="secondary" className="text-xs">
                      Você
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Nenhum usuário online</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
