"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

interface ServerFormActionsProps {
  serverId?: string
  isEditing?: boolean
}

export function ServerFormActions({ serverId, isEditing = false }: ServerFormActionsProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isEditing ? "Servidor atualizado" : "Servidor cadastrado",
        description: isEditing
          ? "As informações do servidor foram atualizadas com sucesso."
          : "O servidor foi cadastrado com sucesso no sistema.",
      })

      router.push(isEditing ? `/servers/${serverId}` : "/servers")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)

    try {
      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Servidor excluído",
        description: "O servidor foi excluído com sucesso do sistema.",
      })

      router.push("/servers")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o servidor.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="flex justify-end gap-4 mt-6">
      <Button
        variant="outline"
        onClick={() => router.push(isEditing ? `/servers/${serverId}` : "/servers")}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>

      {isEditing && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isSubmitting}>
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o servidor e removerá seus dados do
                sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Processando..." : isEditing ? "Atualizar" : "Salvar"}
      </Button>
    </div>
  )
}
