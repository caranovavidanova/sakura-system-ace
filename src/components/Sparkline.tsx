interface SparklineProps {
  valores: number[];
  cor?: string;
}

const LARGURA = 240;
const ALTURA = 64;

export function Sparkline({ valores, cor = "#B38DAC" }: SparklineProps) {
  if (valores.length === 0) {
    return <div style={{ height: ALTURA }} />;
  }

  const max = Math.max(...valores, 0);
  const min = Math.min(...valores, 0);
  const amplitude = max - min || 1;
  const passo = valores.length > 1 ? LARGURA / (valores.length - 1) : 0;

  const pontos = valores.map((valor, i) => {
    const x = i * passo;
    const y = ALTURA - ((valor - min) / amplitude) * ALTURA;
    return `${x},${y}`;
  });

  const area = `0,${ALTURA} ${pontos.join(" ")} ${LARGURA},${ALTURA}`;

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      preserveAspectRatio="none"
      className="h-16 w-full"
    >
      <polygon points={area} fill={cor} opacity={0.12} />
      <polyline
        points={pontos.join(" ")}
        fill="none"
        stroke={cor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
