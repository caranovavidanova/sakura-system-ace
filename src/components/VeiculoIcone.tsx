import { corVeiculoParaHex } from "@/lib/corVeiculo";
import type { TipoVeiculo } from "@/types/cliente";

interface VeiculoIconeProps {
  tipo: TipoVeiculo | null;
  cor?: string | null;
  className?: string;
}

const COR_PNEU = "#2b2b2e";
const COR_JANELA = "rgba(20, 18, 25, 0.55)";
const COR_CONTORNO = "rgba(20, 18, 25, 0.25)";

function Roda({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={COR_PNEU} />
      <circle cx={cx} cy={cy} r={r * 0.45} fill="#6b6b70" />
    </>
  );
}

function CorpoCarro({ d, cor }: { d: string; cor: string }) {
  return <path d={d} fill={cor} stroke={COR_CONTORNO} strokeWidth={1} strokeLinejoin="round" />;
}

function Vidro({ d }: { d: string }) {
  return <path d={d} fill={COR_JANELA} />;
}

function Hatch({ cor }: { cor: string }) {
  return (
    <svg viewBox="0 0 160 80" className="h-full w-full">
      <CorpoCarro
        cor={cor}
        d="M18,64 L18,54 C18,48 22,42 30,40 C36,28 44,20 48,20 L95,18 C100,18 106,24 112,34 C118,42 122,48 122,54 L142,54 L142,64 Z"
      />
      <Vidro d="M50,22 L93,20 C97,20 102,26 108,34 L56,36 C52,32 50,27 50,22 Z" />
      <Roda cx={42} cy={66} r={10} />
      <Roda cx={118} cy={66} r={10} />
    </svg>
  );
}

function Sedan({ cor }: { cor: string }) {
  return (
    <svg viewBox="0 0 160 80" className="h-full w-full">
      <CorpoCarro
        cor={cor}
        d="M16,64 L16,52 C16,46 20,41 26,40 C32,28 40,22 46,22 L80,20 C88,20 96,22 100,24 C106,27 110,32 112,38 L122,38 C128,38 133,42 138,50 C141,55 144,58 144,64 Z"
      />
      <Vidro d="M48,24 L78,22 C84,22 90,24 96,27 C100,29 103,32 106,36 L58,38 C53,34 50,29 48,24 Z" />
      <Roda cx={44} cy={66} r={10} />
      <Roda cx={122} cy={66} r={10} />
    </svg>
  );
}

function Suv({ cor }: { cor: string }) {
  return (
    <svg viewBox="0 0 160 80" className="h-full w-full">
      <CorpoCarro
        cor={cor}
        d="M16,58 L16,44 C16,38 19,32 24,30 C28,20 34,15 40,14 L108,13 C114,13 120,19 124,28 C130,32 134,38 134,44 L134,58 Z"
      />
      <Vidro d="M36,17 L106,16 C110,16 114,20 118,27 L38,28 C36,25 35,21 36,17 Z" />
      <Roda cx={42} cy={66} r={11} />
      <Roda cx={112} cy={66} r={11} />
    </svg>
  );
}

function Picape({ cor }: { cor: string }) {
  return (
    <svg viewBox="0 0 160 80" className="h-full w-full">
      <CorpoCarro
        cor={cor}
        d="M14,62 L14,50 C14,44 18,38 22,36 C27,25 34,19 38,19 L58,18 C63,18 68,23 70,32 L70,38 L146,38 C150,38 154,42 154,50 L154,62 Z"
      />
      <Vidro d="M40,21 L57,20 C60,20 63,24 65,31 L42,33 C40,29 39,25 40,21 Z" />
      <path d="M70,38 L146,38 L146,40 L70,40 Z" fill={COR_CONTORNO} />
      <Roda cx={40} cy={66} r={10} />
      <Roda cx={130} cy={66} r={10} />
    </svg>
  );
}

function Moto({ cor }: { cor: string }) {
  return (
    <svg viewBox="0 0 160 80" className="h-full w-full">
      <path d="M40,56 L62,42" stroke={COR_PNEU} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M114,56 L98,32" stroke={COR_PNEU} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M96,30 L104,22" stroke={COR_PNEU} strokeWidth={4} fill="none" strokeLinecap="round" />
      <rect x={66} y={40} width={20} height={10} rx={3} fill={COR_PNEU} />
      <path
        d="M58,42 C58,32 66,26 78,26 C88,26 95,29 97,33 L100,38 C101,40 99,42 96,42 L62,44 C59,44 58,43 58,42 Z"
        fill={cor}
        stroke={COR_CONTORNO}
      />
      <circle cx={112} cy={40} r={4} fill={COR_PNEU} />
      <Roda cx={30} cy={58} r={14} />
      <Roda cx={122} cy={58} r={14} />
    </svg>
  );
}

export function VeiculoIcone({ tipo, cor, className }: VeiculoIconeProps) {
  const corHex = corVeiculoParaHex(cor);
  const Icone =
    tipo === "sedan"
      ? Sedan
      : tipo === "suv"
        ? Suv
        : tipo === "picape"
          ? Picape
          : tipo === "moto"
            ? Moto
            : Hatch;

  return (
    <div className={className}>
      <Icone cor={corHex} />
    </div>
  );
}
