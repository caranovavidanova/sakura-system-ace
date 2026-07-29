import { useNavigate } from "react-router-dom";

interface BotaoVoltarProps {
  // Sem isso, volta pra rota anterior (histórico do navegador) — usado nas
  // telas de lista. Passar essa prop nos formulários, apontando pro mesmo
  // callback do botão "Cancelar", pra voltar pra lista em vez de mudar de rota.
  onClick?: () => void;
}

export function BotaoVoltar({ onClick }: BotaoVoltarProps) {
  const navigate = useNavigate();

  // Sem onClick (telas de lista): o botão leva pro Início, então usa ícone de
  // casinha em vez de seta — navega direto pra "/" (não pelo histórico do
  // navegador), pra garantir que sempre volta pro Início mesmo depois de
  // navegar entre vários módulos pelo menu lateral.
  if (!onClick) {
    return (
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Início"
        title="Início"
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
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
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
