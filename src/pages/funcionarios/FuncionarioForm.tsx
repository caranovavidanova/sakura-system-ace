import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import {
  ESTADOS_CIVIS,
  TIPOS_SANGUINEOS,
  type Funcionario,
  type NovoFuncionario,
  type NovoFuncionarioFilho,
} from "@/types/funcionario";

interface FuncionarioFormProps {
  funcionarioExistente?: Funcionario;
  onSalvar: (funcionario: NovoFuncionario, filhos: NovoFuncionarioFilho[]) => Promise<void>;
  onCancelar: () => void;
}

const dadosVazios: NovoFuncionario = {
  nome: "",
  cargo: "",
  cpf: null,
  rg: null,
  cnh_categoria: null,
  cnh_numero: null,
  data_nascimento: null,
  estado_civil: null,
  tipo_sanguineo: null,
  cep: null,
  endereco: null,
  numero: null,
  bairro: null,
  cidade: null,
  estado: null,
  complemento: null,
  telefone: null,
  celular: null,
  email: null,
  pis: null,
  codigo_registro: null,
  cbo: null,
  salario: null,
  comissao: null,
  admissao: null,
  data_ferias: null,
  pai: null,
  mae: null,
  naturalidade: null,
  sexo: null,
  conjuge_nome: null,
  conjuge_nascimento: null,
  data_casamento: null,
  conjuge_telefone: null,
  conjuge_celular: null,
};

const filhoVazio: NovoFuncionarioFilho = { nome: "", data_nascimento: null };

type Aba = "gerais" | "familia";

export function FuncionarioForm({
  funcionarioExistente,
  onSalvar,
  onCancelar,
}: FuncionarioFormProps) {
  const editando = Boolean(funcionarioExistente);
  const [aba, setAba] = useState<Aba>("gerais");
  const [dados, setDados] = useState<NovoFuncionario>(
    funcionarioExistente
      ? { ...dadosVazios, ...funcionarioExistente }
      : dadosVazios,
  );
  const [filhos, setFilhos] = useState<NovoFuncionarioFilho[]>(
    funcionarioExistente?.filhos?.map((f) => ({
      nome: f.nome,
      data_nascimento: f.data_nascimento,
    })) ?? [],
  );
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function campo<K extends keyof NovoFuncionario>(chave: K, valor: NovoFuncionario[K]) {
    setDados((atual) => ({ ...atual, [chave]: valor }));
  }

  function adicionarFilho() {
    setFilhos((atual) => [...atual, { ...filhoVazio }]);
  }

  function removerFilho(index: number) {
    setFilhos((atual) => atual.filter((_, i) => i !== index));
  }

  function atualizarFilho(index: number, patch: Partial<NovoFuncionarioFilho>) {
    setFilhos((atual) => atual.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      const filhosPreenchidos = filhos.filter((f) => f.nome.trim());
      await onSalvar({ ...dados, nome: dados.nome.trim(), cargo: dados.cargo?.trim() || null }, filhosPreenchidos);
    } catch (err) {
      console.error("Erro ao salvar funcionário:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sakura-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <h2 className="text-lg font-semibold text-sakura-purple-dark">
          {editando ? "Editar funcionário" : "Novo funcionário"}
        </h2>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}

      {funcionarioExistente?.operador_id && (
        <p className="rounded-lg bg-sakura-pink-soft/60 px-4 py-2 text-xs text-sakura-purple-dark/80">
          Também é operador do sistema (login @{funcionarioExistente.operador?.usuario}) — nome e
          status ativo/inativo desse cadastro seguem o que estiver em Configurações →
          Operadores.
        </p>
      )}

      <div className="flex gap-1 border-b border-sakura-gray/30">
        <AbaBotao label="Dados gerais" ativa={aba === "gerais"} onClick={() => setAba("gerais")} />
        <AbaBotao label="Família" ativa={aba === "familia"} onClick={() => setAba("familia")} />
      </div>

      {aba === "gerais" ? (
        <div className="space-y-5">
          <Secao titulo="Identificação">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <Campo label="Nome" obrigatorio>
                <input
                  type="text"
                  required
                  value={dados.nome}
                  onChange={(e) => campo("nome", e.target.value)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Cargo">
                <input
                  type="text"
                  value={dados.cargo ?? ""}
                  onChange={(e) => campo("cargo", e.target.value)}
                  placeholder="Ex: Mecânico, Vendedor, Faxineira"
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Data de nascimento">
                <input
                  type="date"
                  value={dados.data_nascimento ?? ""}
                  onChange={(e) => campo("data_nascimento", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Sexo">
                <select
                  value={dados.sexo ?? ""}
                  onChange={(e) => campo("sexo", e.target.value || null)}
                  className={inputClasse}
                >
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </Campo>
              <Campo label="Estado civil">
                <select
                  value={dados.estado_civil ?? ""}
                  onChange={(e) => campo("estado_civil", e.target.value || null)}
                  className={inputClasse}
                >
                  <option value="">Selecione</option>
                  {ESTADOS_CIVIS.map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Tipo sanguíneo">
                <select
                  value={dados.tipo_sanguineo ?? ""}
                  onChange={(e) => campo("tipo_sanguineo", e.target.value || null)}
                  className={inputClasse}
                >
                  <option value="">Selecione</option>
                  {TIPOS_SANGUINEOS.map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
          </Secao>

          <Secao titulo="Documentos">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Campo label="CPF">
                <input
                  type="text"
                  value={dados.cpf ?? ""}
                  onChange={(e) => campo("cpf", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="RG">
                <input
                  type="text"
                  value={dados.rg ?? ""}
                  onChange={(e) => campo("rg", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="CNH categoria">
                <input
                  type="text"
                  value={dados.cnh_categoria ?? ""}
                  onChange={(e) => campo("cnh_categoria", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Nº CNH">
                <input
                  type="text"
                  value={dados.cnh_numero ?? ""}
                  onChange={(e) => campo("cnh_numero", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
            </div>
          </Secao>

          <Secao titulo="Endereço">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Campo label="CEP">
                <input
                  type="text"
                  value={dados.cep ?? ""}
                  onChange={(e) => campo("cep", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Endereço" className="md:col-span-2">
                <input
                  type="text"
                  value={dados.endereco ?? ""}
                  onChange={(e) => campo("endereco", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Número">
                <input
                  type="text"
                  value={dados.numero ?? ""}
                  onChange={(e) => campo("numero", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Bairro">
                <input
                  type="text"
                  value={dados.bairro ?? ""}
                  onChange={(e) => campo("bairro", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Cidade">
                <input
                  type="text"
                  value={dados.cidade ?? ""}
                  onChange={(e) => campo("cidade", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Estado">
                <input
                  type="text"
                  maxLength={2}
                  value={dados.estado ?? ""}
                  onChange={(e) => campo("estado", e.target.value.toUpperCase() || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Complemento">
                <input
                  type="text"
                  value={dados.complemento ?? ""}
                  onChange={(e) => campo("complemento", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
            </div>
          </Secao>

          <Secao titulo="Contato">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <Campo label="Telefone">
                <input
                  type="text"
                  value={dados.telefone ?? ""}
                  onChange={(e) => campo("telefone", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Celular">
                <input
                  type="text"
                  value={dados.celular ?? ""}
                  onChange={(e) => campo("celular", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="E-mail">
                <input
                  type="email"
                  value={dados.email ?? ""}
                  onChange={(e) => campo("email", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
            </div>
          </Secao>

          <Secao titulo="Cargo e admissão">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Campo label="PIS">
                <input
                  type="text"
                  value={dados.pis ?? ""}
                  onChange={(e) => campo("pis", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Código de registro">
                <input
                  type="text"
                  value={dados.codigo_registro ?? ""}
                  onChange={(e) => campo("codigo_registro", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="CBO">
                <input
                  type="text"
                  value={dados.cbo ?? ""}
                  onChange={(e) => campo("cbo", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Admissão">
                <input
                  type="date"
                  value={dados.admissao ?? ""}
                  onChange={(e) => campo("admissao", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Salário">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={dados.salario?.toString() ?? ""}
                  onChange={(e) =>
                    campo("salario", e.target.value === "" ? null : Number(e.target.value))
                  }
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Comissão (%)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={dados.comissao?.toString() ?? ""}
                  onChange={(e) =>
                    campo("comissao", e.target.value === "" ? null : Number(e.target.value))
                  }
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Data de férias">
                <input
                  type="date"
                  value={dados.data_ferias ?? ""}
                  onChange={(e) => campo("data_ferias", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
            </div>
          </Secao>
        </div>
      ) : (
        <div className="space-y-5">
          <Secao titulo="Filiação">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Campo label="Pai">
                <input
                  type="text"
                  value={dados.pai ?? ""}
                  onChange={(e) => campo("pai", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Mãe">
                <input
                  type="text"
                  value={dados.mae ?? ""}
                  onChange={(e) => campo("mae", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Naturalidade">
                <input
                  type="text"
                  value={dados.naturalidade ?? ""}
                  onChange={(e) => campo("naturalidade", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
            </div>
          </Secao>

          <Secao titulo="Cônjuge">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Campo label="Nome do cônjuge" className="md:col-span-2">
                <input
                  type="text"
                  value={dados.conjuge_nome ?? ""}
                  onChange={(e) => campo("conjuge_nome", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Nascimento">
                <input
                  type="date"
                  value={dados.conjuge_nascimento ?? ""}
                  onChange={(e) => campo("conjuge_nascimento", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Data do casamento">
                <input
                  type="date"
                  value={dados.data_casamento ?? ""}
                  onChange={(e) => campo("data_casamento", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Telefone">
                <input
                  type="text"
                  value={dados.conjuge_telefone ?? ""}
                  onChange={(e) => campo("conjuge_telefone", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
              <Campo label="Celular">
                <input
                  type="text"
                  value={dados.conjuge_celular ?? ""}
                  onChange={(e) => campo("conjuge_celular", e.target.value || null)}
                  className={inputClasse}
                />
              </Campo>
            </div>
          </Secao>

          <Secao titulo="Filhos">
            <div className="space-y-3">
              {filhos.map((filho, index) => (
                <div key={index} className="flex items-end gap-3">
                  <Campo label="Nome do filho(a)" className="flex-1">
                    <input
                      type="text"
                      value={filho.nome}
                      onChange={(e) => atualizarFilho(index, { nome: e.target.value })}
                      className={inputClasse}
                    />
                  </Campo>
                  <Campo label="Nascimento">
                    <input
                      type="date"
                      value={filho.data_nascimento ?? ""}
                      onChange={(e) =>
                        atualizarFilho(index, { data_nascimento: e.target.value || null })
                      }
                      className={inputClasse}
                    />
                  </Campo>
                  <button
                    type="button"
                    onClick={() => removerFilho(index)}
                    className="mb-1 text-xs font-medium text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={adicionarFilho}
                className="text-sm font-medium text-sakura-purple hover:underline"
              >
                + Adicionar filho(a)
              </button>
            </div>
          </Secao>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar funcionário"}
        </button>
      </div>
    </form>
  );
}

const inputClasse =
  "rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-sakura-purple-dark">{titulo}</legend>
      {children}
    </fieldset>
  );
}

function Campo({
  label,
  obrigatorio,
  className,
  children,
}: {
  label: string;
  obrigatorio?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${className ?? ""}`}>
      <span className="text-sakura-purple-dark/80">
        {label} {obrigatorio && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
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
      type="button"
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
