import { supabase } from "./supabase";
import type { RegistroAuditoria } from "@/types/auditoria";

const LIMITE_PADRAO = 200;

export interface FiltrosAuditoria {
  tabela?: string;
  operadorId?: string;
}

export async function listarAuditoria(
  filtros: FiltrosAuditoria = {},
): Promise<RegistroAuditoria[]> {
  let consulta = supabase
    .from("auditoria")
    .select("*, operador:operadores(nome)")
    .order("criado_em", { ascending: false })
    .limit(LIMITE_PADRAO);

  if (filtros.tabela) {
    consulta = consulta.eq("tabela", filtros.tabela);
  }
  if (filtros.operadorId) {
    consulta = consulta.eq("operador_id", filtros.operadorId);
  }

  const { data, error } = await consulta;
  if (error) throw error;
  return data as unknown as RegistroAuditoria[];
}
