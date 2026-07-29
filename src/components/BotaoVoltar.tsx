import { useNavigate } from "react-router-dom";

interface BotaoVoltarProps {
  // Sem isso, volta pra rota anterior (histórico do navegador) — usado nas
  // telas de lista. Passar essa prop nos formulários, apontando pro mesmo
  // callback do botão "Cancelar", pra voltar pra lista em vez de mudar de rota.
  onClick?: () => void;
}

export function BotaoVoltar({ onClick }: BotaoVoltarProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={onClick ?? (() => navigate(-1))}
      aria-label="Voltar"
      title="Voltar"
      className="sakura-icon-button"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
