import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import {
  paraNovaPeca,
  paraQuantidadeInicial,
  paraValoresFormulario,
  pecaFormSchema,
  type PecaFormValues,
} from "@/schemas/peca";
import type { Categoria } from "@/types/categoria";
import type { NovaPeca, Peca } from "@/types/peca";
import { DadosCadastraisFields } from "./campos/DadosCadastraisFields";
import { PrecosFields } from "./campos/PrecosFields";
import { TributosFields } from "./campos/TributosFields";

interface PecaFormProps {
  pecaExistente?: Peca;
  categorias: Categoria[];
  onSalvar: (peca: NovaPeca, quantidadeInicial: number | null) => Promise<void>;
  onCancelar: () => void;
}

export function PecaForm({ pecaExistente, categorias, onSalvar, onCancelar }: PecaFormProps) {
  const [erro, setErro] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PecaFormValues>({
    resolver: zodResolver(pecaFormSchema),
    defaultValues: paraValoresFormulario(pecaExistente),
  });

  async function aoSubmeter(valores: PecaFormValues) {
    setErro(null);
    try {
      await onSalvar(paraNovaPeca(valores), paraQuantidadeInicial(valores));
    } catch (err) {
      console.error("Erro ao salvar peça:", err);
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <form onSubmit={handleSubmit(aoSubmeter)} className="space-y-6 sakura-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <h2 className="text-lg font-semibold text-sakura-purple-dark">
          {pecaExistente ? "Editar produto" : "Novo produto"}
        </h2>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}

      <DadosCadastraisFields
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
        categorias={categorias}
      />
      <TributosFields register={register} errors={errors} />
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
          className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
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
