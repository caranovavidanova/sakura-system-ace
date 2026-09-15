import { useEffect, useState } from "react";
import { buscarVersaoDoBanco } from "@/lib/schemaVersao";
import { situacaoDoEsquema, type SituacaoEsquema } from "@/schemas/versaoEsquema";

const DESCONHECIDO: SituacaoEsquema = {
  estado: "desconhecido",
  versaoBanco: null,
  versaoApp: 0,
  faltando: [],
};

/**
 * Compara a versão do banco com a que esta build espera, uma vez por abertura
 * (item TR-05.7).
 *
 * `ativo` existe porque a consulta exige estar logado — antes disso a RLS
 * responderia vazio, o que seria lido como "banco antigo" e mostraria um aviso
 * falso na tela de login.
 *
 * Erro nunca vira aviso: se a consulta falhar, a situação fica "desconhecido"
 * e nada aparece.
 */
export function useSituacaoDoEsquema(ativo: boolean): SituacaoEsquema {
  const [situacao, setSituacao] = useState<SituacaoEsquema>(DESCONHECIDO);

  useEffect(() => {
    if (!ativo) {
      setSituacao(DESCONHECIDO);
      return;
    }

    let cancelado = false;
    buscarVersaoDoBanco()
      .then((versao) => {
        if (!cancelado) setSituacao(situacaoDoEsquema(versao));
      })
      .catch(() => {
        if (!cancelado) setSituacao(DESCONHECIDO);
      });

    return () => {
      cancelado = true;
    };
  }, [ativo]);

  return situacao;
}
