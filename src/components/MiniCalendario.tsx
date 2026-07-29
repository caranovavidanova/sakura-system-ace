interface EventoCalendario {
  dia: number;
  tipo: "feriado" | "aniversario" | "conta_a_vencer" | "conta_vencida";
  nome: string;
}

interface MiniCalendarioProps {
  ano: number;
  mes: number; // 0-11
  eventos: EventoCalendario[];
}

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const NOMES_MES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function MiniCalendario({ ano, mes, eventos }: MiniCalendarioProps) {
  const hoje = new Date();
  const ehMesAtual = hoje.getFullYear() === ano && hoje.getMonth() === mes;

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  const eventosPorDia = new Map<number, EventoCalendario[]>();
  for (const evento of eventos) {
    const lista = eventosPorDia.get(evento.dia) ?? [];
    lista.push(evento);
    eventosPorDia.set(evento.dia, lista);
  }

  const celulas: (number | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  return (
    <div className="sakura-card p-4">
      <p className="mb-3 text-sm font-semibold text-sakura-purple-dark">
        {NOMES_MES[mes]}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DIAS_SEMANA.map((dia, i) => (
          <div key={i} className="py-1 font-medium text-sakura-purple-dark/75">
            {dia}
          </div>
        ))}
        {celulas.map((dia, i) => {
          if (dia === null) return <div key={`vazio-${i}`} />;
          const eventosDoDia = eventosPorDia.get(dia) ?? [];
          const feriado = eventosDoDia.find((e) => e.tipo === "feriado");
          const aniversario = eventosDoDia.find((e) => e.tipo === "aniversario");
          const contaVencida = eventosDoDia.find((e) => e.tipo === "conta_vencida");
          const contaAVencer = eventosDoDia.find((e) => e.tipo === "conta_a_vencer");
          const ehHoje = ehMesAtual && hoje.getDate() === dia;

          return (
            <div
              key={dia}
              title={eventosDoDia.map((e) => e.nome).join(", ") || undefined}
              className={`flex flex-col items-center gap-0.5 rounded-lg py-1 ${
                ehHoje ? "bg-sakura-purple text-white" : "text-sakura-purple-dark"
              } ${feriado && !ehHoje ? "bg-sakura-pink-soft" : ""}`}
            >
              <span>{dia}</span>
              {(feriado || aniversario || contaVencida || contaAVencer) && (
                <span className="flex gap-0.5">
                  {feriado && (
                    <span className="h-1.5 w-1.5 rounded-full bg-sakura-purple" />
                  )}
                  {aniversario && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  )}
                  {contaAVencer && (
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  )}
                  {contaVencida && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {eventos.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-sakura-gray/20 pt-3">
          {eventos
            .sort((a, b) => a.dia - b.dia)
            .map((evento, i) => (
              <p key={i} className="text-xs text-sakura-muted">
                <span className="font-medium text-sakura-purple-dark">
                  {String(evento.dia).padStart(2, "0")}
                </span>{" "}
                — {evento.nome}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
