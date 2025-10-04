"use client";
import { Button } from "@/app/Frontend/components/ui/button";
import { useTransition } from "react";
import { createBook } from "@/app/types/book";

export function QuickActions() {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() =>
          start(async () => {
            createBook(
              "Novo Livro",
              "Autor Desconhecido",
              "Gênero Desconhecido",
              2024,
              0,
              "fechado",
              0
            );
          })
        }
        disabled={pending}
      >
        {pending ? "Adicionando…" : "Adicionar Livro Rápido"}
      </Button>
    </div>
  );
}
