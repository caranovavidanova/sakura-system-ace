import type { UseFormRegister } from "react-hook-form";
import type { PecaFormValues } from "@/schemas/peca";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

/**
 * O bloco de pneu (item TL-12 do guia). Só aparece quando a categoria
 * escolhida é a de pneus — ver `ehCategoriaDePneu` em `schemas/peca.ts`.
 *
 * Existe porque o pneu é a peça que essa loja mais vende, o dado está escrito
 * na lateral dele, e hoje ele só existia afogado na descrição em texto livre
 * — o que impede responder "tem 175/70 R14?" sem ler peça por peça. Com o
 * campo separado, a medida entra na busca da lista de Produtos.
 *
 * Os três são opcionais de propósito: cadastro de balcão é feito com o carro
 * esperando, e exigir o DOT de um pneu que acabou de chegar seria trocar um
 * problema por outro.
 */
export function PneuFields({ register }: { register: UseFormRegister<PecaFormValues> }) {
  return (
    <Secao titulo="Pneu">
      <div className="grid grid-cols-3 gap-4">
        <Campo
          label="Medida"
          explicacao="A medida escrita na lateral do pneu, por exemplo 175/70 R14 — largura, altura e aro. É por ela que a busca da lista de Produtos encontra o pneu."
        >
          <input
            type="text"
            placeholder="175/70 R14"
            {...register("medida")}
            className={inputClasse}
          />
        </Campo>
        <Campo
          label="Índice de carga e velocidade"
          explicacao="Vem logo depois da medida, na lateral do pneu — por exemplo 84T. O número é quanto peso o pneu aguenta; a letra é a velocidade máxima."
        >
          <input
            type="text"
            placeholder="84T"
            {...register("indice_carga_velocidade")}
            className={inputClasse}
          />
        </Campo>
        <Campo
          label="DOT (semana/ano)"
          explicacao="Os quatro números finais do código DOT, na lateral do pneu: semana e ano de fabricação. 3823 quer dizer 38ª semana de 2023. Serve para saber se o pneu está envelhecendo no estoque."
        >
          <input type="text" placeholder="3823" {...register("dot")} className={inputClasse} />
        </Campo>
      </div>
    </Secao>
  );
}
