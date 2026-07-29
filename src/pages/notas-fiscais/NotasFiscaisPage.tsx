import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { TipoNotaFiscal } from "@/types/notaFiscal";
import { ArquivosSection } from "./ArquivosSection";

export function NotasFiscaisPage() {
  const [aba, setAba] = useState<TipoNotaFiscal>("nfe");

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <BotaoVoltar />
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">Notas Fiscais</h1>
          <p className="text-sm text-sakura-muted">
            Arquivos XML de NFe e NFS-e, organizados por mês — a emissão automática ainda
            não existe, então por enquanto é upload manual das notas já emitidas por fora
          </p>
        </div>
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a enviar arquivos de verdade.
        </p>
      )}

      <div className="flex gap-1 border-b border-sakura-gray/30">
        <AbaBotao label="NFe" ativa={aba === "nfe"} onClick={() => setAba("nfe")} />
        <AbaBotao label="NFS-e" ativa={aba === "nfse"} onClick={() => setAba("nfse")} />
      </div>

      {isSupabaseConfigured && <ArquivosSection tipo={aba} />}
    </div>
  );
}

function AbaBotao({
  label,
  ativa,
  onClick,
}: {
  label: string;
  ativa: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium transition-colors ${
        ativa
          ? "border-b-2 border-sakura-purple text-sakura-purple-dark"
          : "text-sakura-purple-dark/85 hover:text-sakura-purple-dark"
      }`}
    >
      {label}
    </button>
  );
}
