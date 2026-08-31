import { chaveData, diasDoCalendario } from "@/lib/calendario";

export interface EventoCalendario {
  data: string; // "YYYY-MM-DD"
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
  const chaveDeHoje = chaveData(new Date());

  const eventosPorData = new Map<string, EventoCalendario[]>();
  for (const evento of eventos) {
    const lista = eventosPorData.get(evento.data) ?? [];
    lista.push(evento);
    eventosPorData.set(evento.data, lista);
  }

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
        {diasDoCalendario(ano, mes).map((data) => {
          const chave = chaveData(data);
          const eventosDoDia = eventosPorData.get(chave) ?? [];
          const feriado = eventosDoDia.find((e) => e.tipo === "feriado");
          const aniversario = eventosDoDia.find((e) => e.tipo === "aniversario");
          const contaVencida = eventosDoDia.find((e) => e.tipo === "conta_vencida");
          const contaAVencer = eventosDoDia.find((e) => e.tipo === "conta_a_vencer");
          const ehHoje = chave === chaveDeHoje;
          // Dia de outro mês: fica visível, mas apagado, pra ler como "isso
          // não é deste mês" sem esconder um vencimento que está chegando.
          const deOutroMes = data.getMonth() !== mes;

          return (
            <div
              key={chave}
              title={eventosDoDia.map((e) => e.nome).join(", ") || undefined}
              className={`flex flex-col items-center gap-0.5 rounded-lg py-1 ${
                ehHoje
                  ? "bg-sakura-purple text-white"
                  : deOutroMes
                    ? "text-sakura-purple-dark/35"
                    : "text-sakura-purple-dark"
              } ${feriado && !ehHoje ? "bg-sakura-pink-soft" : ""} ${
                deOutroMes && !ehHoje ? "opacity-80" : ""
              }`}
            >
              <span>{data.getDate()}</span>
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
          {[...eventos]
            .sort((a, b) => a.data.localeCompare(b.data))
            .map((evento, i) => {
              const [, mesEvento, diaEvento] = evento.data.split("-");
              const deOutroMes = Number(mesEvento) - 1 !== mes;
              return (
                <p key={i} className="text-xs text-sakura-muted">
                  <span className="font-medium text-sakura-purple-dark">
                    {deOutroMes ? `${diaEvento}/${mesEvento}` : diaEvento}
                  </span>{" "}
                  — {evento.nome}
                </p>
              );
            })}
        </div>
      )}
    </div>
  );
}
