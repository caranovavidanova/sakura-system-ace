import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Combobox } from "@/components/Combobox";
import type { OrdemServicoFormValues } from "@/schemas/ordemServico";
import type { Cliente } from "@/types/cliente";
import type { Funcionario } from "@/types/funcionario";
import { Campo, inputClasse } from "./FormCompartilhado";

export function DetalhesFields({
  register,
  watch,
  setValue,
  errors,
  clientes,
  funcionarios,
}: {
  register: UseFormRegister<OrdemServicoFormValues>;
  watch: UseFormWatch<OrdemServicoFormValues>;
  setValue: UseFormSetValue<OrdemServicoFormValues>;
  errors: FieldErrors<OrdemServicoFormValues>;
  clientes: Cliente[];
  funcionarios: Funcionario[];
}) {
  const clienteId = watch("cliente_id");
  const veiculosDoCliente = clientes.find((c) => c.id === clienteId)?.veiculos ?? [];

  return (
    <section className="grid grid-cols-2 gap-4">
      <Campo label="Cliente" obrigatorio erro={errors.cliente_id?.message}>
        <Combobox
          opcoes={clientes.map((cliente) => ({ valor: cliente.id, rotulo: cliente.nome }))}
          valor={clienteId}
          onMudar={(v) => {
            setValue("cliente_id", v);
            setValue("veiculo_id", "");
          }}
          opcaoVazia="Selecione o cliente"
          placeholder="Selecione o cliente"
        />
      </Campo>

      <Campo label="Veículo">
        <Combobox
          opcoes={veiculosDoCliente.map((veiculo) => ({
            valor: veiculo.id,
            rotulo: `${veiculo.placa} — ${veiculo.marca ?? ""} ${veiculo.modelo ?? ""}`,
          }))}
          valor={watch("veiculo_id")}
          onMudar={(v) => setValue("veiculo_id", v)}
          desabilitado={!clienteId}
          opcaoVazia="Sem veículo vinculado"
          placeholder="Sem veículo vinculado"
        />
      </Campo>

      <Campo label="KM de entrada">
        <input type="number" {...register("km_entrada")} className={inputClasse} />
      </Campo>

      <Campo label="Vendedor / atendente">
        <Combobox
          opcoes={funcionarios.map((funcionario) => ({
            valor: funcionario.id,
            rotulo: funcionario.nome,
          }))}
          valor={watch("vendedor_id")}
          onMudar={(v) => setValue("vendedor_id", v)}
          placeholder="Selecione o vendedor"
        />
      </Campo>

      <Campo label="Observação" className="col-span-2">
        <textarea rows={2} {...register("descricao_problema")} className={inputClasse} />
      </Campo>
    </section>
  );
}
