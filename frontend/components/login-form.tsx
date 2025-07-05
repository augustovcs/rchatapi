"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/types/chat"
import { MessageCircle, Users, Zap } from "lucide-react"

interface LoginFormProps {
  onLogin: (user: User) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      id: Date.now().toString(),
      name: name.trim(),
      isOnline: true,
      lastSeen: new Date(),
    }

    onLogin(user)
    setIsLoading(false)
  }

  const generateRandomName = () => {
    const adjectives = ["Rápido", "Inteligente", "Criativo", "Amigável", "Corajoso", "Brilhante"]
    const nouns = ["Gato", "Leão", "Águia", "Tubarão", "Lobo", "Dragão"]
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    setName(`${adj}${noun}${Math.floor(Math.random() * 100)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat Comunitário</h1>
            <p className="text-gray-600 mt-2">Conecte-se e converse em tempo real</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Chat em tempo real</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Múltiplas salas</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Conexão rápida</p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Entre no Chat</CardTitle>
            <CardDescription>Escolha um nome para começar a conversar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {name.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Seu nome de usuário"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={20}
                      className="text-lg"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateRandomName}
                  className="w-full bg-transparent"
                >
                  Gerar nome aleatório
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!name.trim() || isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar no Chat"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Ao entrar, você concorda em ser respeitoso com outros usuários
        </p>
      </div>
    </div>
  )
}
