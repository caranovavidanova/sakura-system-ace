import { useEffect, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { useAuth } from "@/contexts/AuthContext";
import { listarCategorias } from "@/lib/categorias";
import { listarCategoriasCaixa } from "@/lib/categoriasCaixa";
import {
  buscarConfiguracaoFiscal,
  buscarTextoGarantia,
  listarJurosParcelas,
} from "@/lib/configuracoes";
import { mensagemDeErro } from "@/lib/errors";
import { atualizarOperador, criarOperador, listarOperadores } from "@/lib/operadores";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Categoria } from "@/types/categoria";
import type { CategoriaCaixa } from "@/types/categoriaCaixa";
import type { ConfiguracaoFiscalLoja, JurosParcela } from "@/types/configuracao";
import { MODULOS } from "@/types/operador";
import type { NovoOperador, Operador } from "@/types/operador";
import { CategoriasCaixaSection } from "./CategoriasCaixaSection";
import { CategoriasSection } from "./CategoriasSection";
import { DadosFiscaisSection } from "./DadosFiscaisSection";
import { JurosParcelasSection } from "./JurosParcelasSection";
import { OperadorForm } from "./OperadorForm";
import { TextoGarantiaSection } from "./TextoGarantiaSection";

export function ConfiguracoesPage() {
  const { operador: operadorLogado } = useAuth();
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [jurosParcelas, setJurosParcelas] = useState<JurosParcela[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasCaixa, setCategoriasCaixa] = useState<CategoriaCaixa[]>([]);
  const [textoGarantia, setTextoGarantia] = useState("");
  const [configuracaoFiscal, setConfiguracaoFiscal] = useState<ConfiguracaoFiscalLoja | null>(
    null,
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<"novo" | Operador | null>(null);

  async function carregar() {
    if (!isSupabaseConfigured) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const [
        operadoresCarregados,
        jurosCarregados,
        categoriasCarregadas,
        categoriasCaixaCarregadas,
        textoGarantiaCarregado,
        configuracaoFiscalCarregada,
      ] = await Promise.all([
        listarOperadores(),
        listarJurosParcelas(),
        listarCategorias(),
        listarCategoriasCaixa(),
        buscarTextoGarantia(),
        buscarConfiguracaoFiscal(),
      ]);
      setOperadores(operadoresCarregados);
      setJurosParcelas(jurosCarregados);
      setCategorias(categoriasCarregadas);
      setCategoriasCaixa(categoriasCaixaCarregadas);
      setTextoGarantia(textoGarantiaCarregado);
      setConfiguracaoFiscal(configuracaoFiscalCarregada);
    } catch (err) {
      console.error("Erro ao carregar operadores:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSalvar(operador: NovoOperador, senha: string) {
    if (formulario && formulario !== "novo") {
      await atualizarOperador(formulario.id, {
        nome: operador.nome,
        admin: operador.admin,
        permissoes: operador.permissoes,
        ativo: operador.ativo,
      });
    } else {
      await criarOperador(operador, senha);
    }
    setFormulario(null);
    await carregar();
  }

  async function handleAlternarStatus(op: Operador) {
    try {
      await atualizarOperador(op.id, { ativo: !op.ativo });
      await carregar();
    } catch (err) {
      console.error("Erro ao atualizar status do operador:", err);
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BotaoVoltar />
          <div>
            <h1 className="text-2xl font-semibold text-sakura-purple-dark">
              Configurações
            </h1>
            <p className="text-sm text-sakura-gray">
              Operadores do sistema e permissões de acesso
            </p>
          </div>
        </div>
        {!formulario && (
          <button
            onClick={() => setFormulario("novo")}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Novo operador
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para gerenciar operadores de verdade.
        </p>
      )}

      {formulario && (
        <OperadorForm
          operadorExistente={formulario === "novo" ? undefined : formulario}
          onSalvar={handleSalvar}
          onCancelar={() => setFormulario(null)}
        />
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      {!carregando && (
        <>
          <JurosParcelasSection jurosParcelas={jurosParcelas} onSalvo={carregar} />
          <CategoriasSection categorias={categorias} onSalvo={carregar} />
          <CategoriasCaixaSection categorias={categoriasCaixa} onSalvo={carregar} />
          <TextoGarantiaSection texto={textoGarantia} onSalvo={carregar} />
          <DadosFiscaisSection configuracao={configuracaoFiscal} onSalvo={carregar} />
        </>
      )}

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : operadores.length === 0 ? (
        <p className="text-sm text-sakura-gray">
          Nenhum operador cadastrado ainda.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {operadores.map((op) => (
            <div
              key={op.id}
              className="sakura-card p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sakura-purple-dark">{op.nome}</p>
                  <p className="text-sm text-sakura-gray">@{op.usuario}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    op.ativo
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-sakura-gray/20 text-sakura-gray"
                  }`}
                >
                  {op.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {op.admin ? (
                  <span className="rounded-full bg-sakura-pink-soft px-2.5 py-1 text-xs font-medium text-sakura-purple-dark">
                    Administrador (acesso total)
                  </span>
                ) : op.permissoes.length === 0 ? (
                  <span className="text-xs text-sakura-gray">
                    Nenhum módulo liberado
                  </span>
                ) : (
                  op.permissoes.map((chave) => (
                    <span
                      key={chave}
                      className="rounded-full bg-sakura-pink-soft px-2.5 py-1 text-xs font-medium text-sakura-purple-dark"
                    >
                      {MODULOS.find((m) => m.chave === chave)?.label ?? chave}
                    </span>
                  ))
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setFormulario(op)}
                  className="text-xs font-medium text-sakura-purple hover:underline"
                >
                  Editar
                </button>
                {op.id !== operadorLogado?.id && (
                  <button
                    onClick={() => handleAlternarStatus(op)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    {op.ativo ? "Inativar" : "Reativar"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
