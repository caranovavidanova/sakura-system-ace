import { useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import type { NovoCliente, NovoVeiculo } from "@/types/cliente";

interface ClienteFormProps {
  onSalvar: (cliente: NovoCliente, veiculos: NovoVeiculo[]) => Promise<void>;
  onCancelar: () => void;
}

const clienteVazio: NovoCliente = {
  nome: "",
  cpf_cnpj: "",
  telefone: "",
  email: "",
  cep: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "",
  data_nascimento: null,
};

const veiculoVazio: NovoVeiculo = {
  placa: "",
  marca: "",
  modelo: "",
  ano: null,
  cor: "",
  km_atual: null,
};

export function ClienteForm({ onSalvar, onCancelar }: ClienteFormProps) {
  const [cliente, setCliente] = useState<NovoCliente>(clienteVazio);
  const [veiculos, setVeiculos] = useState<NovoVeiculo[]>([veiculoVazio]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function atualizarVeiculo(index: number, patch: Partial<NovoVeiculo>) {
    setVeiculos((atual) =>
      atual.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    );
  }

  function adicionarVeiculo() {
    setVeiculos((atual) => [...atual, { ...veiculoVazio }]);
  }

  function removerVeiculo(index: number) {
    setVeiculos((atual) => atual.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      const veiculosPreenchidos = veiculos.filter((v) => v.placa.trim());
      await onSalvar(cliente, veiculosPreenchidos);
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 sakura-card p-6 shadow-sm"
    >
      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
          Dados do cliente
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="Nome completo"
            required
            value={cliente.nome}
            onChange={(v) => setCliente({ ...cliente, nome: v })}
          />
          <Campo
            label="CPF/CNPJ"
            value={cliente.cpf_cnpj ?? ""}
            onChange={(v) => setCliente({ ...cliente, cpf_cnpj: v })}
          />
          <Campo
            label="Telefone"
            value={cliente.telefone ?? ""}
            onChange={(v) => setCliente({ ...cliente, telefone: v })}
          />
          <Campo
            label="E-mail"
            value={cliente.email ?? ""}
            onChange={(v) => setCliente({ ...cliente, email: v })}
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">Data de nascimento</span>
            <input
              type="date"
              value={cliente.data_nascimento ?? ""}
              onChange={(e) =>
                setCliente({ ...cliente, data_nascimento: e.target.value || null })
              }
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
          Endereço
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Campo
            label="CEP"
            value={cliente.cep ?? ""}
            onChange={(v) => setCliente({ ...cliente, cep: v })}
          />
          <Campo
            label="Rua"
            value={cliente.rua ?? ""}
            onChange={(v) => setCliente({ ...cliente, rua: v })}
          />
          <Campo
            label="Número"
            value={cliente.numero ?? ""}
            onChange={(v) => setCliente({ ...cliente, numero: v })}
          />
          <Campo
            label="Bairro"
            value={cliente.bairro ?? ""}
            onChange={(v) => setCliente({ ...cliente, bairro: v })}
          />
          <Campo
            label="Cidade"
            value={cliente.cidade ?? ""}
            onChange={(v) => setCliente({ ...cliente, cidade: v })}
          />
          <Campo
            label="UF"
            value={cliente.uf ?? ""}
            onChange={(v) => setCliente({ ...cliente, uf: v.toUpperCase() })}
          />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-sakura-purple-dark">
            Veículos (opcional)
          </h3>
          <button
            type="button"
            onClick={adicionarVeiculo}
            className="text-xs font-medium text-sakura-purple hover:underline"
          >
            + Adicionar veículo
          </button>
        </div>

        <div className="space-y-4">
          {veiculos.map((veiculo, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-sakura-gray/30 p-4"
            >
              {veiculos.length > 1 && (
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-sakura-gray">
                    Veículo {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removerVeiculo(index)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <Campo
                  label="Placa"
                  value={veiculo.placa}
                  onChange={(v) =>
                    atualizarVeiculo(index, { placa: v.toUpperCase() })
                  }
                />
                <Campo
                  label="Marca"
                  value={veiculo.marca ?? ""}
                  onChange={(v) => atualizarVeiculo(index, { marca: v })}
                />
                <Campo
                  label="Modelo"
                  value={veiculo.modelo ?? ""}
                  onChange={(v) => atualizarVeiculo(index, { modelo: v })}
                />
                <Campo
                  label="Ano"
                  value={veiculo.ano?.toString() ?? ""}
                  onChange={(v) =>
                    atualizarVeiculo(index, { ano: v ? Number(v) : null })
                  }
                />
                <Campo
                  label="Cor"
                  value={veiculo.cor ?? ""}
                  onChange={(v) => atualizarVeiculo(index, { cor: v })}
                />
                <Campo
                  label="KM atual"
                  value={veiculo.km_atual?.toString() ?? ""}
                  onChange={(v) =>
                    atualizarVeiculo(index, { km_atual: v ? Number(v) : null })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/70 hover:bg-sakura-gray/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar cliente"}
        </button>
      </div>
    </form>
  );
}

function Campo({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-sakura-purple-dark/80">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type="text"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
      />
    </label>
  );
}
