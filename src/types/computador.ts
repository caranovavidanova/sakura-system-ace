// Um computador da empresa, como o banco o conhece (migration 0063). Gravado
// só por `registrar_computador()` a cada login; lido pelo admin em
// Configurações → "Computadores desta empresa".
export interface Computador {
  id: string;
  nome_maquina: string;
  apelido: string | null;
  versao_app: string;
  canal: "normal" | "teste";
  sistema: string | null;
  loja_id: string | null;
  operador_id: string | null;
  primeiro_acesso: string;
  visto_em: string;
  loja?: { nome: string } | null;
  operador?: { nome: string } | null;
}
