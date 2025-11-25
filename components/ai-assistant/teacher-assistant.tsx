"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon, Loader2 } from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { ChatMessage } from "@/components/ai-assistant/chat-message"
import { PromptTemplates } from "@/components/ai-assistant/prompt-templates"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TeacherAssistant() {
  const [inputValue, setInputValue] = useState("")
  const { messages, isLoading, sendMessage, clearMessages } = useChat()
  const [language, setLanguage] = useState<"pt" | "en">("pt")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleTemplateSelect = (template: string) => {
    setInputValue(template)
  }

  const translations = {
    pt: {
      title: "Assistente de IA para Professores",
      description:
        "Use o poder da inteligência artificial para auxiliar no planejamento de aulas e avaliação de alunos.",
      inputPlaceholder: "Digite sua pergunta ou solicitação aqui...",
      sendButton: "Enviar",
      clearButton: "Limpar conversa",
      loadingMessage: "Gerando resposta...",
      emptyState: "Faça uma pergunta para começar a conversa.",
      templates: "Modelos de prompts",
      chat: "Conversa",
    },
    en: {
      title: "AI Assistant for Teachers",
      description: "Use the power of artificial intelligence to assist with lesson planning and student assessment.",
      inputPlaceholder: "Type your question or request here...",
      sendButton: "Send",
      clearButton: "Clear conversation",
      loadingMessage: "Generating response...",
      emptyState: "Ask a question to start the conversation.",
      templates: "Prompt templates",
      chat: "Chat",
    },
  }

  const t = translations[language]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage("pt")}
              className={language === "pt" ? "bg-primary text-primary-foreground" : ""}
            >
              PT
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage("en")}
              className={language === "en" ? "bg-primary text-primary-foreground" : ""}
            >
              EN
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chat">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">{t.chat}</TabsTrigger>
            <TabsTrigger value="templates">{t.templates}</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="space-y-4 mt-4">
            <div className="h-[500px] overflow-y-auto border rounded-md p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">{t.emptyState}</div>
              ) : (
                messages.map((message, index) => <ChatMessage key={index} message={message} />)
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t.loadingMessage}</span>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="templates" className="mt-4">
            <PromptTemplates onSelect={handleTemplateSelect} language={language} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Textarea
            placeholder={t.inputPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={clearMessages}>
              {t.clearButton}
            </Button>
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.loadingMessage}
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" />
                  {t.sendButton}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  )
}
