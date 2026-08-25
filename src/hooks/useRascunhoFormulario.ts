import { useEffect, useRef } from "react";
import type { FieldValues, UseFormWatch } from "react-hook-form";

const INTERVALO_AUTOSAVE_MS = 30_000;

// Cópia de segurança local (localStorage) do que já foi digitado num
// formulário — não é um "salvar" de verdade (não manda nada pro banco, não
// mexe no botão de Salvar), só uma rede de segurança pra oferecer de volta
// caso o app feche/recarregue no meio do preenchimento. Salva a cada 30s
// enquanto o formulário estiver aberto.
export function useRascunhoFormulario<T extends FieldValues>(
  chave: string,
  watch: UseFormWatch<T>,
): void {
  const valoresRef = useRef<T | null>(null);

  useEffect(() => {
    const inscricao = watch((valores) => {
      valoresRef.current = valores as T;
    });
    return () => inscricao.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (!valoresRef.current) return;
      try {
        localStorage.setItem(chave, JSON.stringify(valoresRef.current));
      } catch {
        // localStorage indisponível/cheio — autosave é só conveniência, não trava o app
      }
    }, INTERVALO_AUTOSAVE_MS);
    return () => clearInterval(intervalo);
  }, [chave]);
}

export function lerRascunhoFormulario<T>(chave: string): T | null {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : null;
  } catch {
    return null;
  }
}

export function limparRascunhoFormulario(chave: string): void {
  try {
    localStorage.removeItem(chave);
  } catch {
    // idem — não crítico
  }
}
