export interface EnderecoViaCep {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

// API pública do ViaCEP — sem chave, sem custo. Devolve null se o CEP não
// tiver 8 dígitos, não existir, ou a busca falhar (sem internet, etc.) —
// nesses casos o formulário só continua permitindo preenchimento manual.
export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoViaCep | null> {
  const limpo = cep.replace(/\D/g, "");
  if (limpo.length !== 8) return null;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    if (!resposta.ok) return null;
    const dados = await resposta.json();
    if (dados.erro) return null;
    return {
      logradouro: dados.logradouro ?? "",
      bairro: dados.bairro ?? "",
      localidade: dados.localidade ?? "",
      uf: dados.uf ?? "",
    };
  } catch {
    return null;
  }
}
