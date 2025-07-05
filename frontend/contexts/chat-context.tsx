"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import * as signalR from "@microsoft/signalr"
import type { Message, User, ChatRoom, ConnectionState } from "@/types/chat"
import { toast } from "@/hooks/use-toast"

interface ChatContextType {
  connection: signalR.HubConnection | null
  messages: Message[]
  users: User[]
  rooms: ChatRoom[]
  currentRoom: string
  currentUser: User | null
  connectionState: ConnectionState
  sendMessage: (content: string, type?: "text" | "emoji") => Promise<void>
  joinRoom: (roomId: string) => Promise<void>
  setCurrentUser: (user: User | null) => void
  setCurrentRoom: (roomId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: User
}) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [rooms] = useState<ChatRoom[]>([
    { id: "general", name: "Geral", description: "Conversa geral", userCount: 0, isPrivate: false },
    { id: "tech", name: "Tecnologia", description: "Discussões sobre tech", userCount: 0, isPrivate: false },
    { id: "random", name: "Aleatório", description: "Conversas aleatórias", userCount: 0, isPrivate: false },
  ])
  const [currentRoom, setCurrentRoom] = useState("general")
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser)
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  useEffect(() => {
    if (!currentUser) return

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5074/chathub")
      .configureLogging(signalR.LogLevel.Trace)
      .withAutomaticReconnect()
      .build()

    setConnection(newConnection)
    startConnection(newConnection)

    return () => {
      newConnection.stop()
    }
  }, [currentUser])

  const startConnection = async (conn: signalR.HubConnection) => {
    console.log("Tentando iniciar conexão com o ChatHub...")
    setConnectionState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      await conn.start()
      console.log("Conexão com o chat iniciada com sucesso.")
      setConnectionState({ isConnected: true, isConnecting: false, error: null })

      await conn.invoke("JoinRoom", currentRoom, currentUser?.name)

      toast({
        title: "Conectado!",
        description: "Você está conectado ao chat.",
      })

      setupEventListeners(conn)
    } catch (error) {
      console.error("Erro ao conectar:", error)
      setConnectionState({
        isConnected: false,
        isConnecting: false,
        error: "Falha ao conectar ao servidor",
      })
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor de chat.",
        variant: "destructive",
      })
    }
  }

  const setupEventListeners = (conn: signalR.HubConnection) => {
    conn.on("ReceiveMessage", (user, message, room, messageId) => {
      const newMessage: Message = {
        id: messageId,
        user,
        content: message,
        timestamp: new Date(),
        room,
        type: "text",
      }
      setMessages((prev) => [...prev, newMessage])
    })

    conn.on("UserJoined", (user, room) => {
      const systemMessage: Message = {
        id: Date.now().toString(),
        user: "Sistema",
        content: `${user} entrou na sala`,
        timestamp: new Date(),
        room,
        type: "system",
      }
      setMessages((prev) => [...prev, systemMessage])
    })

    conn.on("UserLeft", (user, room) => {
      const systemMessage: Message = {
        id: Date.now().toString(),
        user: "Sistema",
        content: `${user} saiu da sala`,
        timestamp: new Date(),
        room,
        type: "system",
      }
      setMessages((prev) => [...prev, systemMessage])
    })

    conn.on("UpdateUserList", (userList: string[]) => {
      const updatedUsers: User[] = userList.map((name) => ({
        id: name,
        name,
        isOnline: true,
        lastSeen: new Date(),
      }))
      setUsers(updatedUsers)
    })

    conn.onclose(() => {
      setConnectionState({ isConnected: false, isConnecting: false, error: "Conexão perdida" })
      toast({
        title: "Desconectado",
        description: "Conexão com o servidor foi perdida.",
        variant: "destructive",
      })
    })

    conn.onreconnecting(() => {
      setConnectionState((prev) => ({ ...prev, isConnecting: true }))
    })

    conn.onreconnected(() => {
      setConnectionState({ isConnected: true, isConnecting: false, error: null })
      toast({
        title: "Reconectado!",
        description: "Conexão restaurada com sucesso.",
      })
    })
  }

  const sendMessage = async (content: string, type: "text" | "emoji" = "text") => {
    if (!connection || !currentUser || !content.trim()) return

    try {
      await connection.invoke("SendMessage", currentUser.name, content, currentRoom)
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      })
    }
  }

  const joinRoom = async (roomId: string) => {
    if (!connection || !currentUser) return

    try {
      await connection.invoke("LeaveRoom", currentRoom)
      await connection.invoke("JoinRoom", roomId, currentUser.name)
      setCurrentRoom(roomId)
      setMessages([])
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível entrar na sala.",
        variant: "destructive",
      })
    }
  }

  return (
    <ChatContext.Provider
      value={{
        connection,
        messages,
        users,
        rooms,
        currentRoom,
        currentUser,
        connectionState,
        sendMessage,
        joinRoom,
        setCurrentUser,
        setCurrentRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
