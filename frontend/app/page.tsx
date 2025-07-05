"use client"

import { useState } from "react"
import { ChatProvider } from "@/contexts/chat-context"
import { LoginForm } from "@/components/login-form"
import { ChatInterface } from "@/components/chat-interface"
import { Toaster } from "@/components/ui/toaster"
import type { User } from "@/types/chat"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  if (!currentUser) {
    return (
      <>
        <LoginForm onLogin={setCurrentUser} />
        <Toaster />
      </>
    )
  }

  return (
    <ChatProvider initialUser={currentUser}>
      <div className="h-screen">
        <ChatInterface />
      </div>
      <Toaster />
    </ChatProvider>
  )
}
