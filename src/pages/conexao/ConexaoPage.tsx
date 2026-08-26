import { useState } from "react";
import { Logo } from "@/components/Logo";
import { conexaoAtual, salvarConexao, testarConexao } from "@/lib/conexao";
import { mensagemDeErro } from "@/lib/errors";

interface ConexaoPageProps {
  // Só existe quando já há uma conexão configurada — na primeira abertura não
  // há pra onde voltar, então o botão não aparece.
  onCancelar?: () => void;
}

const inputClasse =
  "rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none placeholder:text-white/40 focus:border-sakura-pink focus:ring-1 focus:ring-sakura-pink transition-all";

export function ConexaoPage({ onCancelar }: ConexaoPageProps) {
  // Só vem preenchido quando a usuária está trocando uma conexão já
  // existente; na primeira abertura os campos nascem vazios de propósito.
  const inicial = conexaoAtual();
  const [url, setUrl] = useState(inicial?.url ?? "");
  const [chave, setChave] = useState(inicial?.chave ?? "");
  const [testando, setTestando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [testeOk, setTesteOk] = useState(false);

  const dadosPreenchidos = url.trim() !== "" && chave.trim() !== "";

  function aoEditar(novoValor: string, campo: "url" | "chave") {
    setErro(null);
    setTesteOk(false);
    if (campo === "url") setUrl(novoValor);
    else setChave(novoValor);
  }

  async function handleTestar() {
    setErro(null);
    setTesteOk(false);
    setTestando(true);
    try {
      await testarConexao({ url: url.trim(), chave: chave.trim() });
      setTesteOk(true);
    } catch (err) {
      console.error("Erro ao testar conexão:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setTestando(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      const conexao = { url: url.trim(), chave: chave.trim() };
      // Testa antes de gravar: salvar um endereço errado deixaria o app numa
      // tela de login que nunca funciona, sem explicação nenhuma.
      await testarConexao(conexao);
      // Não precisa desligar "salvando": o app recarrega inteiro em seguida.
      await salvarConexao(conexao);
    } catch (err) {
      console.error("Erro ao salvar conexão:", err);
      setErro(mensagemDeErro(err));
      setSalvando(false);
    }
  }

  return (
    <div
      className="flex h-screen items-center justify-center overflow-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}sakura-login-bg-premium.png)` }}
    >
      <div className="sakura-card my-8 w-full max-w-lg p-8">
        <div className="mb-6 flex justify-center">
          <Logo className="drop-shadow-sm" />
        </div>

        <h1 className="text-center text-xl font-semibold text-sakura-purple-dark">
          Conectar ao banco de dados da loja
        </h1>
        <p className="mb-6 text-center text-sm text-sakura-purple-dark/90">
          Só precisa fazer isso uma vez neste computador. Os dois valores abaixo ficam no painel
          do Supabase da sua empresa, em <strong>Settings → API</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && (
            <p className="rounded-lg bg-red-50/90 px-4 py-2 text-sm text-red-700">{erro}</p>
          )}

          {testeOk && !erro && (
            <p className="rounded-lg bg-emerald-50/90 px-4 py-2 text-sm text-emerald-800">
              Conexão funcionando. Pode salvar.
            </p>
          )}

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/90">Endereço do projeto (URL)</span>
            <input
              type="text"
              value={url}
              onChange={(e) => aoEditar(e.target.value, "url")}
              placeholder="https://xxxxxxxx.supabase.co"
              className={inputClasse}
              autoComplete="off"
              spellCheck={false}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/90">Chave pública (anon / publishable)</span>
            <textarea
              value={chave}
              onChange={(e) => aoEditar(e.target.value, "chave")}
              placeholder="Cole aqui a chave anon do seu projeto"
              rows={3}
              className={`${inputClasse} resize-none font-mono text-xs`}
              autoComplete="off"
              spellCheck={false}
            />
            <span className="text-xs text-sakura-muted">
              É a chave <strong>anon</strong> (também chamada de publishable) — não a
              <em> service role</em>, que é secreta e não deve ser usada aqui.
            </span>
          </label>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            {onCancelar && (
              <button
                type="button"
                onClick={onCancelar}
                className="mr-auto rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleTestar}
              disabled={!dadosPreenchidos || testando || salvando}
              className="rounded-xl border border-sakura-purple/60 px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-purple/10 disabled:opacity-50"
            >
              {testando ? "Testando..." : "Testar conexão"}
            </button>
            <button
              type="submit"
              disabled={!dadosPreenchidos || testando || salvando}
              className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar e entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
