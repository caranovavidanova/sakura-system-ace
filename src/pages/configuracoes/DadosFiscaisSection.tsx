import { useState } from "react";
import { salvarConfiguracaoFiscal } from "@/lib/configuracoes";
import { mensagemDeErro } from "@/lib/errors";
import { REGIME_TRIBUTARIO_LABEL } from "@/types/configuracao";
import type {
  AmbienteFocusNfe,
  ConfiguracaoFiscalLoja,
  RegimeTributario,
} from "@/types/configuracao";

interface DadosFiscaisSectionProps {
  configuracao: ConfiguracaoFiscalLoja | null;
  onSalvo: () => Promise<void>;
}

type FormularioFiscal = Omit<ConfiguracaoFiscalLoja, "id" | "atualizado_em">;

function valorInicial(configuracao: ConfiguracaoFiscalLoja | null): FormularioFiscal {
  return {
    cnpj: configuracao?.cnpj ?? "",
    razao_social: configuracao?.razao_social ?? "",
    nome_fantasia: configuracao?.nome_fantasia ?? "",
    inscricao_estadual: configuracao?.inscricao_estadual ?? "",
    inscricao_municipal: configuracao?.inscricao_municipal ?? "",
    regime_tributario: configuracao?.regime_tributario ?? null,
    cep: configuracao?.cep ?? "",
    rua: configuracao?.rua ?? "",
    numero: configuracao?.numero ?? "",
    bairro: configuracao?.bairro ?? "",
    cidade: configuracao?.cidade ?? "",
    uf: configuracao?.uf ?? "",
    telefone: configuracao?.telefone ?? "",
    email: configuracao?.email ?? "",
    focus_nfe_token: configuracao?.focus_nfe_token ?? "",
    focus_nfe_ambiente: configuracao?.focus_nfe_ambiente ?? "homologacao",
  };
}

const campoClasse =
  "w-full rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm text-sakura-purple-dark outline-none focus:border-sakura-purple";

export function DadosFiscaisSection({ configuracao, onSalvo }: DadosFiscaisSectionProps) {
  const [valores, setValores] = useState<FormularioFiscal>(() => valorInicial(configuracao));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  function set<K extends keyof FormularioFiscal>(campo: K, valor: FormularioFiscal[K]) {
    setValores((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSalvar() {
    setErro(null);
    setSalvo(false);
    setSalvando(true);
    try {
      await salvarConfiguracaoFiscal({
        ...valores,
        cnpj: valores.cnpj || null,
        razao_social: valores.razao_social || null,
        nome_fantasia: valores.nome_fantasia || null,
        inscricao_estadual: valores.inscricao_estadual || null,
        inscricao_municipal: valores.inscricao_municipal || null,
        cep: valores.cep || null,
        rua: valores.rua || null,
        numero: valores.numero || null,
        bairro: valores.bairro || null,
        cidade: valores.cidade || null,
        uf: valores.uf || null,
        telefone: valores.telefone || null,
        email: valores.email || null,
        focus_nfe_token: valores.focus_nfe_token || null,
      });
      await onSalvo();
      setSalvo(true);
    } catch (err) {
      console.error("Erro ao salvar dados fiscais:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      {erro && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>}
      {salvo && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          Dados fiscais salvos.
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          CNPJ
          <input
            value={valores.cnpj ?? ""}
            onChange={(e) => set("cnpj", e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Inscrição estadual
          <input
            value={valores.inscricao_estadual ?? ""}
            onChange={(e) => set("inscricao_estadual", e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Inscrição municipal
          <input
            value={valores.inscricao_municipal ?? ""}
            onChange={(e) => set("inscricao_municipal", e.target.value)}
            className={campoClasse}
          />
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Razão social
          <input
            value={valores.razao_social ?? ""}
            onChange={(e) => set("razao_social", e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Nome fantasia
          <input
            value={valores.nome_fantasia ?? ""}
            onChange={(e) => set("nome_fantasia", e.target.value)}
            className={campoClasse}
          />
        </label>

        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Regime tributário
          <select
            value={valores.regime_tributario ?? ""}
            onChange={(e) =>
              set("regime_tributario", (e.target.value || null) as RegimeTributario | null)
            }
            className={campoClasse}
          >
            <option value="">Selecione...</option>
            {(Object.keys(REGIME_TRIBUTARIO_LABEL) as RegimeTributario[]).map((chave) => (
              <option key={chave} value={chave}>
                {REGIME_TRIBUTARIO_LABEL[chave]}
              </option>
            ))}
          </select>
        </label>
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Telefone
          <input
            value={valores.telefone ?? ""}
            onChange={(e) => set("telefone", e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          E-mail
          <input
            type="email"
            value={valores.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            className={campoClasse}
          />
        </label>

        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          CEP
          <input
            value={valores.cep ?? ""}
            onChange={(e) => set("cep", e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Rua
          <input
            value={valores.rua ?? ""}
            onChange={(e) => set("rua", e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Número
          <input
            value={valores.numero ?? ""}
            onChange={(e) => set("numero", e.target.value)}
            className={campoClasse}
          />
        </label>

        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Bairro
          <input
            value={valores.bairro ?? ""}
            onChange={(e) => set("bairro", e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          Cidade
          <input
            value={valores.cidade ?? ""}
            onChange={(e) => set("cidade", e.target.value)}
            className={campoClasse}
          />
        </label>
        <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
          UF
          <input
            value={valores.uf ?? ""}
            onChange={(e) => set("uf", e.target.value.toUpperCase())}
            maxLength={2}
            className={campoClasse}
          />
        </label>
      </div>

      <div className="mt-6 border-t border-sakura-gray/20 pt-4">
        <p className="text-xs font-medium text-sakura-purple-dark/90">Integração Focus NFe</p>
        <p className="mt-1 text-xs text-sakura-muted">
          Cole aqui o token de acesso quando assinar um plano no Focus NFe. Use o ambiente de
          homologação pra testar sem gerar nota de verdade.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <label className="col-span-2 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
            Token de acesso
            <input
              type="password"
              value={valores.focus_nfe_token ?? ""}
              onChange={(e) => set("focus_nfe_token", e.target.value)}
              className={campoClasse}
            />
          </label>
          <label className="col-span-1 flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
            Ambiente
            <select
              value={valores.focus_nfe_ambiente}
              onChange={(e) => set("focus_nfe_ambiente", e.target.value as AmbienteFocusNfe)}
              className={campoClasse}
            >
              <option value="homologacao">Homologação (teste)</option>
              <option value="producao">Produção</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSalvar}
          disabled={salvando}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar dados fiscais"}
        </button>
      </div>
    </>
  );
}
