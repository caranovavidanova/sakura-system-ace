import { useNavigate } from "react-router-dom";

/**
 * A placa de um carro como atalho pra ficha dele (item FN-04).
 *
 * É um botão, e não um texto com cara de link, pra ter o alvo de clique que
 * o resto das listas tem (item TR-02.1: 32px de altura) — e pra funcionar de
 * teclado. O `stopPropagation` existe porque ele mora dentro de linhas de
 * tabela que já têm clique próprio (na lista de OS, clicar na linha abre a
 * OS): sem ele, o mesmo clique abriria as duas coisas.
 */
export function LinkPlaca({ veiculoId, placa }: { veiculoId: string; placa: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/veiculos/${veiculoId}`);
      }}
      title={`Ver a ficha do veículo ${placa}`}
      className="inline-flex min-h-8 items-center rounded-lg border border-sakura-borda-campo px-2 font-medium tracking-wide text-sakura-purple-dark hover:bg-white/10"
    >
      {placa}
    </button>
  );
}
