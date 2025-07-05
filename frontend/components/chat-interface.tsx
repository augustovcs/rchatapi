"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useChat } from "@/contexts/chat-context"
import { Send, Smile, LogOut, Users, Hash, MessageCircle } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { UsersList } from "./users-list"
import { RoomsList } from "./rooms-list"
import { EmojiPicker } from "./emoji-picker"
import { ConnectionStatus } from "./connection-status"

export function ChatInterface() {
  const { messages, currentRoom, currentUser, connectionState, sendMessage, setCurrentUser } = useChat()

  const [messageInput, setMessageInput] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showUsersList, setShowUsersList] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentRoomMessages = messages.filter((msg) => msg.room === currentRoom)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentRoomMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !connectionState.isConnected) return

    await sendMessage(messageInput.trim())
    setMessageInput("")
    inputRef.current?.focus()
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {currentUser?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-900">{currentUser?.name}</h2>
                <ConnectionStatus />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-hidden">
          <RoomsList />
        </div>

        {/* Users Toggle */}
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowUsersList(!showUsersList)}>
            <Users className="w-4 h-4 mr-2" />
            {showUsersList ? "Ocultar Usuários" : "Ver Usuários Online"}
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Hash className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 capitalize">{currentRoom}</h1>
                <p className="text-sm text-gray-500">{currentRoomMessages.length} mensagens</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Online
            </Badge>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentRoomMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mensagem ainda</h3>
                    <p className="text-gray-500">Seja o primeiro a enviar uma mensagem nesta sala!</p>
                  </div>
                ) : (
                  currentRoomMessages.map((message) => (
                    <ChatMessage key={message.id} message={message} isOwn={message.user === currentUser?.name} />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Mensagem para #${currentRoom}...`}
                    disabled={!connectionState.isConnected}
                    maxLength={500}
                    className="pr-12 resize-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2">
                      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!messageInput.trim() || !connectionState.isConnected}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{messageInput.length}/500 caracteres</span>
                <span>Pressione Enter para enviar</span>
              </div>
            </div>
          </div>

          {/* Users List Sidebar */}
          {showUsersList && (
            <div className="w-64 bg-white border-l border-gray-200">
              <UsersList />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
