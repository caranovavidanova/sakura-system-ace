import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AvisoRascunho } from "@/components/AvisoRascunho";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { useRascunho } from "@/hooks/useRascunhoFormulario";
import { mensagemDeErro } from "@/lib/errors";
import {
  ehCategoriaDePneu,
  paraNovaPeca,
  paraQuantidadeInicial,
  paraValoresFormulario,
  pecaFormSchema,
  type PecaFormValues,
} from "@/schemas/peca";
import type { Categoria } from "@/types/categoria";
import type { RegimeTributario } from "@/types/configuracao";
import type { NovaPeca, Peca } from "@/types/peca";
import { DadosCadastraisFields } from "./campos/DadosCadastraisFields";
import { PneuFields } from "./campos/PneuFields";
import { PrecosFields } from "./campos/PrecosFields";
import { TributosFields } from "./campos/TributosFields";

interface PecaFormProps {
  pecaExistente?: Peca;
  categorias: Categoria[];
  /** Regime da loja (Configurações → Dados fiscais) — decide se o código de
   *  ICMS desta peça é CSOSN ou CST, e alimenta o aviso de incompatível. */
  regime: RegimeTributario | null;
  /** O código de ICMS que a própria loja mais usa no cadastro dela, usado
   *  pra pré-preencher uma peça nova em vez de deixar o campo em branco. */
  csosnSugerido: string | null;
  onSalvar: (peca: NovaPeca, quantidadeInicial: number | null) => Promise<void>;
  onCancelar: () => void;
}

export function PecaForm({
  pecaExistente,
  categorias,
  regime,
  csosnSugerido,
  onSalvar,
  onCancelar,
}: PecaFormProps) {
  const [erro, setErro] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PecaFormValues>({
    resolver: zodResolver(pecaFormSchema),
    defaultValues: paraValoresFormulario(pecaExistente),
  });

  const rascunho = useRascunho(
    `rascunho-peca-${pecaExistente?.id ?? "nova"}`,
    watch,
    reset,
  );

  async function aoSubmeter(valores: PecaFormValues) {
    setErro(null);
    try {
      await onSalvar(paraNovaPeca(valores), paraQuantidadeInicial(valores));
      rascunho.limpar();
    } catch (err) {
      console.error("Erro ao salvar peça:", err);
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <form onSubmit={handleSubmit(aoSubmeter)} className="space-y-6 sakura-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <h2 className="text-subtitulo font-semibold text-sakura-purple-dark">
          {pecaExistente ? "Editar produto" : "Novo produto"}
        </h2>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-corpo text-red-700">{erro}</p>
      )}

      {rascunho.rascunho && (
        <AvisoRascunho
          descricao="deste produto"
          onRestaurar={rascunho.restaurar}
          onDescartar={rascunho.descartar}
        />
      )}

      <DadosCadastraisFields
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
        categorias={categorias}
      />
      {/* O bloco de pneu só aparece quando a categoria escolhida é a de
          pneus — é a peça que essa loja mais vende, e a medida ficava
          afogada na descrição em texto livre. */}
      {ehCategoriaDePneu(categorias.find((c) => c.id === watch("categoria_id"))?.nome) && (
        <PneuFields register={register} />
      )}
      <TributosFields
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
        regime={regime}
        csosnSugerido={csosnSugerido}
        editando={Boolean(pecaExistente)}
      />
      <PrecosFields
        register={register}
        watch={watch}
        setValue={setValue}
        editando={Boolean(pecaExistente)}
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl px-4 py-2 text-corpo font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-corpo font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting
            ? "Salvando..."
            : pecaExistente
              ? "Salvar alterações"
              : "Salvar peça"}
        </button>
      </div>
    </form>
  );
}
