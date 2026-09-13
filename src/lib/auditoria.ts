import { supabase } from "./supabase";
import type { AcaoAuditoria, RegistroAuditoria } from "@/types/auditoria";

const LIMITE_PADRAO = 200;

export interface FiltrosAuditoria {
  tabela?: string;
  operadorId?: string;
  acao?: AcaoAuditoria;
}

export async function listarAuditoria(
  filtros: FiltrosAuditoria = {},
): Promise<RegistroAuditoria[]> {
  let consulta = supabase
    .from("auditoria")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(LIMITE_PADRAO);

  if (filtros.tabela) {
    consulta = consulta.eq("tabela", filtros.tabela);
  }
  if (filtros.operadorId) {
    consulta = consulta.eq("operador_id", filtros.operadorId);
  }
  if (filtros.acao) {
    consulta = consulta.eq("acao", filtros.acao);
  }

  const { data, error } = await consulta;
  if (error) throw error;
  return data as unknown as RegistroAuditoria[];
}
