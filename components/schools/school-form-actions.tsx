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

interface SchoolFormActionsProps {
  schoolId?: string
  isEditing?: boolean
}

export function SchoolFormActions({ schoolId, isEditing = false }: SchoolFormActionsProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isEditing ? "Escola atualizada" : "Escola cadastrada",
        description: isEditing
          ? "As informações da escola foram atualizadas com sucesso."
          : "A escola foi cadastrada com sucesso no sistema.",
      })

      router.push(isEditing ? `/schools/${schoolId}` : "/schools")
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
        title: "Escola excluída",
        description: "A escola foi excluída com sucesso do sistema.",
      })

      router.push("/schools")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a escola.",
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
        onClick={() => router.push(isEditing ? `/schools/${schoolId}` : "/schools")}
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
                Esta ação não pode ser desfeita. Isso excluirá permanentemente a escola e removerá seus dados do
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
