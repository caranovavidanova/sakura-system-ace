import type { AmbienteFocusNfe } from "@/types/configuracao";

// Sakura System — AutoCenter Edition
// Cliente HTTP genérico para a API do Focus NFe (https://focusnfe.com.br).
// Ainda não emite documento nenhum de verdade — é a "casca" da integração
// (autenticação + URL por ambiente + chamada HTTP), pronta pra receber a
// função de emissão de NFC-e assim que a usuária tiver um token real pra
// testar. Ver PROJETO_STATUS.md seção 8, item 1.
//
// Importante: os nomes exatos dos campos do corpo da requisição de emissão
// (CFOP, NCM, situação tributária do ICMS etc.) ainda **não foram
// confirmados contra a documentação oficial** (não foi possível acessar
// doc.focusnfe.com.br a partir deste ambiente) — antes de usar em produção,
// validar um envio de teste no ambiente de homologação.

const BASE_URL_POR_AMBIENTE: Record<AmbienteFocusNfe, string> = {
  homologacao: "https://homologacao.focusnfe.com.br",
  producao: "https://api.focusnfe.com.br",
};

export class FocusNfeError extends Error {
  constructor(
    message: string,
    public status?: number,
    public corpo?: unknown,
  ) {
    super(message);
    this.name = "FocusNfeError";
  }
}

// Focus NFe autentica via HTTP Basic Auth, usando o token de acesso como
// usuário e senha em branco.
function montarCabecalhoAutenticacao(token: string): string {
  return `Basic ${btoa(`${token}:`)}`;
}

interface ChamarFocusNfeOpcoes {
  metodo: "GET" | "POST" | "PUT" | "DELETE";
  caminho: string;
  token: string;
  ambiente: AmbienteFocusNfe;
  corpo?: unknown;
}

export async function chamarFocusNfe<T>({
  metodo,
  caminho,
  token,
  ambiente,
  corpo,
}: ChamarFocusNfeOpcoes): Promise<T> {
  const url = `${BASE_URL_POR_AMBIENTE[ambiente]}${caminho}`;

  const resposta = await fetch(url, {
    method: metodo,
    headers: {
      Authorization: montarCabecalhoAutenticacao(token),
      "Content-Type": "application/json",
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new FocusNfeError(
      (dados as { mensagem?: string } | null)?.mensagem ??
        `Focus NFe retornou erro ${resposta.status}`,
      resposta.status,
      dados,
    );
  }

  return dados as T;
}

// Ainda não implementado — falta confirmar o formato exato do corpo da
// requisição de emissão de NFC-e (itens, dados tributários por item) contra
// a documentação/sandbox real do Focus NFe antes de codar isso de verdade.
export async function emitirNFCe(): Promise<never> {
  throw new FocusNfeError(
    "A emissão automática de NFC-e ainda não foi implementada — falta validar o formato " +
      "exato do pedido com um token real de teste (ambiente de homologação) do Focus NFe.",
  );
}
