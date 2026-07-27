interface GaugeProps {
  titulo: string;
  percentual: number;
  valorPrincipal: string;
  legenda: string;
}

const RAIO = 70;
const CENTRO = 90;
const CIRCUNFERENCIA_MEIA_VOLTA = Math.PI * RAIO;

export function Gauge({ titulo, percentual, valorPrincipal, legenda }: GaugeProps) {
  const percentualLimitado = Math.max(0, Math.min(100, percentual));
  const preenchido = (percentualLimitado / 100) * CIRCUNFERENCIA_MEIA_VOLTA;

  return (
    <div className="rounded-2xl border border-sakura-gray/30 bg-white p-4">
      <p className="mb-1 text-xs text-sakura-gray">{titulo}</p>
      <svg viewBox="0 0 180 100" className="w-full">
        <path
          d={`M 20 90 A ${RAIO} ${RAIO} 0 0 1 160 90`}
          fill="none"
          stroke="#F0E5EE"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {preenchido > 0 && (
          <path
            d={`M 20 90 A ${RAIO} ${RAIO} 0 0 1 160 90`}
            fill="none"
            stroke="#B38DAC"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${preenchido} ${CIRCUNFERENCIA_MEIA_VOLTA}`}
          />
        )}
        <text
          x={CENTRO}
          y="80"
          textAnchor="middle"
          className="fill-sakura-purple-dark"
          style={{ font: "700 22px sans-serif" }}
        >
          {Math.round(percentual)}%
        </text>
      </svg>
      <p className="text-center text-sm font-semibold text-sakura-purple-dark">
        {valorPrincipal}
      </p>
      <p className="text-center text-xs text-sakura-gray">{legenda}</p>
    </div>
  );
}
