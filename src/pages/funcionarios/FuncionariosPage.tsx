import { useEffect, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { useAuth } from "@/contexts/AuthContext";
import { listarContasReceber } from "@/lib/contasReceber";
import { mensagemDeErro } from "@/lib/errors";
import { listarFuncionarios } from "@/lib/funcionarios";
import { listarOrdens } from "@/lib/ordensServico";
import { listarPecas } from "@/lib/pecas";
import { listarServicos } from "@/lib/servicos";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { ContaReceber } from "@/types/contaReceber";
import type { Funcionario } from "@/types/funcionario";
import type { OrdemServico } from "@/types/os";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";
import { ComissoesSection } from "./ComissoesSection";
import { FuncionariosSection } from "./FuncionariosSection";

type Aba = "cadastro" | "comissoes";

export function FuncionariosPage() {
  const { lojaAtual } = useAuth();
  const [aba, setAba] = useState<Aba>("cadastro");
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Dados que só a aba Comissões usa. Ficam separados de propósito: são 4
  // consultas (OS, peças, serviços, contas a receber) que não fazem falta
  // nenhuma pra quem só veio cadastrar funcionário, então só são buscadas
  // quando essa aba é aberta pela primeira vez.
  const [dadosComissoes, setDadosComissoes] = useState<{
    ordens: OrdemServico[];
    pecas: Peca[];
    servicos: Servico[];
    contasReceber: ContaReceber[];
  } | null>(null);
  const [carregandoComissoes, setCarregandoComissoes] = useState(false);

  async function carregar() {
    if (!isSupabaseConfigured || !lojaAtual) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      setFuncionarios(await listarFuncionarios(lojaAtual.id));
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    setDadosComissoes(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lojaAtual?.id]);

  useEffect(() => {
    async function carregarComissoes() {
      if (aba !== "comissoes" || dadosComissoes || !isSupabaseConfigured || !lojaAtual) return;
      setCarregandoComissoes(true);
      setErro(null);
      try {
        const [ordens, pecas, servicos, contasReceber] = await Promise.all([
          listarOrdens(lojaAtual.id),
          listarPecas(),
          listarServicos(),
          listarContasReceber(lojaAtual.id),
        ]);
        setDadosComissoes({ ordens, pecas, servicos, contasReceber });
      } catch (err) {
        console.error("Erro ao carregar comissões:", err);
        setErro(mensagemDeErro(err));
      } finally {
        setCarregandoComissoes(false);
      }
    }
    carregarComissoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba, lojaAtual?.id]);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <BotaoVoltar />
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">Funcionários</h1>
          <p className="text-sm text-sakura-muted">
            Técnicos, vendedores e demais funcionários — e quanto cada um tem de comissão a receber
          </p>
        </div>
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a cadastrar funcionários de verdade.
        </p>
      )}

      {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

      <div className="flex gap-1 border-b border-sakura-gray/30">
        <AbaBotao label="Cadastro" ativa={aba === "cadastro"} onClick={() => setAba("cadastro")} />
        <AbaBotao
          label="Comissões"
          ativa={aba === "comissoes"}
          onClick={() => setAba("comissoes")}
        />
      </div>

      {aba === "cadastro" ? (
        carregando ? (
          <p className="text-sm text-sakura-muted">Carregando...</p>
        ) : !lojaAtual ? (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Seu usuário não tem loja atribuída. Fale com o administrador.
          </p>
        ) : (
          <FuncionariosSection
            funcionarios={funcionarios}
            lojaId={lojaAtual.id}
            onRecarregar={carregar}
          />
        )
      ) : carregandoComissoes || !dadosComissoes ? (
        <p className="text-sm text-sakura-muted">Carregando...</p>
      ) : (
        <ComissoesSection
          ordens={dadosComissoes.ordens}
          pecas={dadosComissoes.pecas}
          servicos={dadosComissoes.servicos}
          funcionarios={funcionarios}
          contasReceber={dadosComissoes.contasReceber}
        />
      )}
    </div>
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
