// A promessa deste teste em uma frase: o botão NUNCA deixa um banco pela
// metade sem dizer, e NUNCA aplica nada se algum ensaio falhou.
//
// Aqui o `psql` é de mentira — cada banco é um objeto que sabe em que versão
// está e quais migrations "quebram" nele. O teste com Postgres de verdade é o
// scripts/atualizar-bancos.integracao.mjs (roda no CI, no job da matriz de RLS).
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  atualizarBancos,
  avisosDaMigration,
  lerEmpresas,
  listarMigrations,
  montarResumo,
  pendentes,
  resumirErro,
  scriptDeAplicacao,
  scriptDeEnsaio,
  segredosDaConexao,
  ultimaMigrationIniciada,
  // @ts-expect-error — script utilitário em .mjs puro, sem tipos
} from "./atualizar-bancos.mjs";

interface BancoFalso {
  /** null = banco sem schema_versao (anterior à 0055). */
  versao: number | null;
  /** Migrations que dão erro neste banco (o "dado da loja" que não deixa). */
  quebraEm?: number[];
  /** Não responde nem à conexão. */
  fora?: boolean;
  aplicadas: number[];
  ensaios: number;
}

function migracoes(...numeros: number[]) {
  return numeros.map((n) => ({
    numero: n,
    arquivo: `${String(n).padStart(4, "0")}_x.sql`,
    caminho: `/repo/supabase/migrations/${String(n).padStart(4, "0")}_x.sql`,
  }));
}

function psqlFalso(bancos: Record<string, BancoFalso>) {
  return async ({ banco, argumentos = [], entrada }: { banco: string; argumentos?: string[]; entrada?: string }) => {
    const b = bancos[banco];
    if (!b) throw new Error(`banco desconhecido ${banco}`);
    if (b.fora) return { codigo: 2, saida: "", erro: 'psql: error: connection to server at "x" failed: timeout expired' };

    const sql = argumentos[1] ?? "";
    if (sql.includes("to_regclass")) return { codigo: 0, saida: b.versao === null ? "f\n" : "t\n", erro: "" };
    if (sql.includes("max(versao)")) return { codigo: 0, saida: `${b.versao}\n`, erro: "" };

    const numeros = [...String(entrada).matchAll(/(\d{4})_x\.sql/g)].map((m) => Number(m[1]));
    const ensaio = String(entrada).includes("rollback;");
    if (ensaio) {
      b.ensaios++;
      let saida = "";
      for (const n of numeros) {
        saida += `@@sakura-migration ${n}\n`;
        if (b.quebraEm?.includes(n)) {
          return { codigo: 3, saida, erro: `psql:/repo/${n}_x.sql:7: ERROR:  check constraint "ck_x" is violated by some row\n` };
        }
      }
      return { codigo: 0, saida, erro: "NOTICE:  relation \"x\" already exists, skipping\nNOTICE:  trava ck_y NAO criada: 2 linhas violam\n" };
    }
    // aplicação: uma migration por vez
    const [n] = numeros;
    if (b.quebraEm?.includes(n)) return { codigo: 3, saida: "", erro: "ERROR:  deu ruim de verdade\n" };
    b.aplicadas.push(n);
    b.versao = n;
    return { codigo: 0, saida: "", erro: "" };
  };
}

function banco(versao: number | null, extra: Partial<BancoFalso> = {}): BancoFalso {
  return { versao, aplicadas: [], ensaios: 0, ...extra };
}

const empresas = (...nomes: string[]) => nomes.map((nome) => ({ nome, banco: nome }));
const silencio = () => {};

describe("lerEmpresas", () => {
  it("lê a lista do BACKUP_EMPRESAS, ignorando os campos do backup", () => {
    const texto = JSON.stringify([
      { nome: "pneus-amigao", banco: "postgresql://u:s@h/p", supabase_url: "x", service_role_key: "y" },
      { nome: "loja-2", banco: "postgresql://u:t@h/p" },
    ]);
    expect(lerEmpresas(texto)).toEqual([
      { nome: "pneus-amigao", banco: "postgresql://u:s@h/p" },
      { nome: "loja-2", banco: "postgresql://u:t@h/p" },
    ]);
  });

  it("explica em português cada defeito de formato", () => {
    expect(() => lerEmpresas("")).toThrow(/vazio/);
    expect(() => lerEmpresas("eyJhbGciOi")).toThrow(/LISTA inteira/);
    expect(() => lerEmpresas('{"nome":"a","banco":"b"}')).toThrow(/precisa ser uma LISTA/);
    expect(() => lerEmpresas("[]")).toThrow(/lista vazia/);
    expect(() => lerEmpresas('[{"nome":"a"}]')).toThrow(/número 1.*"banco"/);
    expect(() => lerEmpresas('[{"nome":"a","banco":"x"},{"banco":"y"}]')).toThrow(/número 2.*"nome"/);
    expect(() => lerEmpresas('[{"nome":"a","banco":"x"},{"nome":"a","banco":"y"}]')).toThrow(/duas vezes/);
  });
});

describe("segredosDaConexao", () => {
  it("esconde a linha inteira e a senha sozinha", () => {
    expect(segredosDaConexao("postgresql://postgres.abc:S3nha%21@host:5432/postgres")).toEqual([
      "postgresql://postgres.abc:S3nha%21@host:5432/postgres",
      "S3nha!",
    ]);
    expect(segredosDaConexao("host=x password=y")).toEqual(["host=x password=y"]);
  });
});

describe("listarMigrations", () => {
  it("ordena por NÚMERO, não por texto", () => {
    const pasta = mkdtempSync(join(tmpdir(), "migrations-"));
    try {
      for (const nome of ["0058_b.sql", "0057_a.sql", "10000_futura.sql", "9999_c.sql", "leia-me.md", "sem_numero.sql"]) {
        writeFileSync(join(pasta, nome), "select 1;");
      }
      expect(listarMigrations(pasta).map((m: { numero: number }) => m.numero)).toEqual([57, 58, 9999, 10000]);
    } finally {
      rmSync(pasta, { recursive: true, force: true });
    }
  });

  it("recusa dois arquivos com o mesmo número", () => {
    const pasta = mkdtempSync(join(tmpdir(), "migrations-"));
    try {
      writeFileSync(join(pasta, "0058_a.sql"), "");
      writeFileSync(join(pasta, "0058_b.sql"), "");
      expect(() => listarMigrations(pasta)).toThrow(/número 58/);
    } finally {
      rmSync(pasta, { recursive: true, force: true });
    }
  });

  it("lê as migrations reais do repositório, sem buraco na numeração", () => {
    const reais = listarMigrations("supabase/migrations");
    expect(reais.length).toBeGreaterThan(55);
    reais.forEach((m: { numero: number }, i: number) => expect(m.numero).toBe(i + 1));
  });
});

describe("pendentes e scripts do psql", () => {
  it("pendentes = as de número maior que a versão do banco", () => {
    expect(pendentes(migracoes(55, 56, 57), 55).map((m: { numero: number }) => m.numero)).toEqual([56, 57]);
    expect(pendentes(migracoes(55, 56, 57), 57)).toEqual([]);
  });

  it("o ensaio termina SEMPRE em rollback, e a aplicação em commit", () => {
    const [a, b] = migracoes(56, 57);
    const ensaio = scriptDeEnsaio([a, b]);
    expect(ensaio).toMatch(/^\\set ON_ERROR_STOP on\nbegin;\nset local lock_timeout/);
    expect(ensaio.trim().endsWith("rollback;")).toBe(true);
    expect(ensaio).not.toMatch(/commit/);
    expect(ensaio.indexOf("0056")).toBeLessThan(ensaio.indexOf("0057"));

    const aplicacao = scriptDeAplicacao(a);
    expect(aplicacao.trim().endsWith("commit;")).toBe(true);
    expect(aplicacao).toMatch(/lock_timeout/);
    expect(aplicacao).not.toMatch(/rollback/);
  });

  it("acha em qual migration o ensaio parou", () => {
    expect(ultimaMigrationIniciada("@@sakura-migration 56\n@@sakura-migration 57\n")).toBe(57);
    expect(ultimaMigrationIniciada("")).toBeNull();
  });

  it("tira os NOTICE do motivo do erro, e guarda só os avisos da própria migration", () => {
    const saida = [
      'psql:/r/0056_x.sql:3: NOTICE:  relation "a" already exists, skipping',
      'psql:/r/0056_x.sql:9: NOTICE:  policy "b" for relation "c" does not exist, skipping',
      "psql:/r/0058_x.sql:20: NOTICE:  trava ck_itens_quantidade NAO criada: 3 linhas violam",
      'psql:/r/0058_x.sql:40: ERROR:  column "y" does not exist',
      "LINE 1: select y from z",
    ].join("\n");
    expect(resumirErro(saida)).toBe('ERROR:  column "y" does not exist');
    expect(avisosDaMigration(saida)).toEqual(["trava ck_itens_quantidade NAO criada: 3 linhas violam"]);
  });
});

describe("atualizarBancos — ensaiar", () => {
  it("ensaia em todos, não muda nada, e diz o que falta em cada um", async () => {
    const bancos = { a: banco(55), b: banco(56), c: banco(57) };
    const r = await atualizarBancos({
      modo: "ensaiar",
      empresas: empresas("a", "b", "c"),
      migrations: migracoes(55, 56, 57),
      psql: psqlFalso(bancos),
      log: silencio,
    });
    expect(r.sucesso).toBe(true);
    expect(r.situacoes.map((s: { pendentes: number[] }) => s.pendentes)).toEqual([[56, 57], [57], []]);
    expect(Object.values(bancos).map((b) => b.aplicadas)).toEqual([[], [], []]);
    expect(bancos.c.ensaios).toBe(0); // em dia: nem ensaia
    expect(r.situacoes[0].avisos).toEqual(["trava ck_y NAO criada: 2 linhas violam"]);
  });

  it("continua ensaiando os outros bancos depois de um problema (ensaio não muda nada)", async () => {
    const bancos = { a: banco(55, { quebraEm: [57] }), b: banco(null), c: banco(55), d: banco(56, { fora: true }) };
    const r = await atualizarBancos({
      modo: "ensaiar",
      empresas: empresas("a", "b", "c", "d"),
      migrations: migracoes(55, 56, 57),
      psql: psqlFalso(bancos),
      log: silencio,
    });
    expect(r.sucesso).toBe(false);
    const [a, b, c, d] = r.situacoes;
    expect(a).toMatchObject({ ensaio: "problema", falhouEm: 57 });
    expect(a.motivo).toMatch(/ck_x/);
    expect(b.motivo).toMatch(/schema_versao.*0055/);
    expect(c.ensaio).toBe("ok");
    expect(d.motivo).toMatch(/não consegui falar com o banco/);
    expect(Object.values(bancos).flatMap((x) => x.aplicadas)).toEqual([]);
  });

  it("acusa banco MAIS NOVO que o código (rodado de uma branch antiga)", async () => {
    const r = await atualizarBancos({
      modo: "ensaiar",
      empresas: empresas("a"),
      migrations: migracoes(55, 56),
      psql: psqlFalso({ a: banco(57) }),
      log: silencio,
    });
    expect(r.sucesso).toBe(false);
    expect(r.situacoes[0].motivo).toMatch(/MAIS NOVO.*branch antiga/);
  });
});

describe("atualizarBancos — aplicar", () => {
  it("aplica em ordem, banco por banco, e confere de fora", async () => {
    const bancos = { a: banco(55), b: banco(56), c: banco(57) };
    const r = await atualizarBancos({
      modo: "aplicar",
      empresas: empresas("a", "b", "c"),
      migrations: migracoes(55, 56, 57),
      psql: psqlFalso(bancos),
      log: silencio,
    });
    expect(r.sucesso).toBe(true);
    expect(bancos.a.aplicadas).toEqual([56, 57]);
    expect(bancos.b.aplicadas).toEqual([57]);
    expect(bancos.c.aplicadas).toEqual([]);
    expect(r.situacoes.map((s: { aplicacao: string }) => s.aplicacao)).toEqual(["aplicado", "aplicado", "em-dia"]);
    expect(r.situacoes.map((s: { versaoFinal: number }) => s.versaoFinal)).toEqual([57, 57, 57]);
  });

  it("se QUALQUER ensaio falha, não aplica em NENHUM banco — nem nos que passariam", async () => {
    const bancos = { a: banco(55), b: banco(55, { quebraEm: [57] }), c: banco(56) };
    const r = await atualizarBancos({
      modo: "aplicar",
      empresas: empresas("a", "b", "c"),
      migrations: migracoes(55, 56, 57),
      psql: psqlFalso(bancos),
      log: silencio,
    });
    expect(r.sucesso).toBe(false);
    expect(Object.values(bancos).flatMap((x) => x.aplicadas)).toEqual([]);
    expect(r.conclusao).toMatch(/Nada foi aplicado/);
    expect(r.situacoes.every((s: { aplicacao: string }) => s.aplicacao === "nao-tocado")).toBe(true);
  });

  it("banco sem schema_versao também impede aplicar nos outros", async () => {
    const bancos = { a: banco(55), b: banco(null) };
    const r = await atualizarBancos({
      modo: "aplicar",
      empresas: empresas("a", "b"),
      migrations: migracoes(55, 56),
      psql: psqlFalso(bancos),
      log: silencio,
    });
    expect(r.sucesso).toBe(false);
    expect(bancos.a.aplicadas).toEqual([]);
  });

  it("falha na hora de aplicar (passou no ensaio): para ali, e os seguintes não são tocados", async () => {
    // O ensaio passa (quebraEm só vale na aplicação desse banco falso b).
    const bancos = { a: banco(55), b: banco(55), c: banco(55) };
    const psqlBase = psqlFalso(bancos);
    const psql = async (p: { banco: string; argumentos?: string[]; entrada?: string }) => {
      if (p.banco === "b" && p.entrada && !p.entrada.includes("rollback;") && p.entrada.includes("0057")) {
        return { codigo: 3, saida: "", erro: 'ERROR:  canceling statement due to lock timeout\n' };
      }
      return psqlBase(p);
    };
    const r = await atualizarBancos({
      modo: "aplicar",
      empresas: empresas("a", "b", "c"),
      migrations: migracoes(55, 56, 57),
      psql,
      log: silencio,
    });
    expect(r.sucesso).toBe(false);
    expect(bancos.a.aplicadas).toEqual([56, 57]);
    expect(bancos.b.aplicadas).toEqual([56]); // a 56 ficou; a 57 foi desfeita
    expect(bancos.c.aplicadas).toEqual([]);
    const [, b, c] = r.situacoes;
    expect(b).toMatchObject({ aplicacao: "falhou", falhouEm: 57, versaoFinal: 56 });
    expect(b.motivo).toMatch(/lock timeout/);
    expect(c.aplicacao).toBe("nao-tocado");

    const resumo = montarResumo(r);
    expect(resumo).toMatch(/\| b \| 0055 \| ❌ falhou \(desfeito\) na 0057/);
    expect(resumo).toMatch(/\| c \| 0055 \| — não mexido \| 0055 \|/);
  });

  it("recusa modo inventado antes de encostar em banco", async () => {
    const bancos = { a: banco(55) };
    await expect(
      atualizarBancos({ modo: "aplicar-tudo", empresas: empresas("a"), migrations: migracoes(55, 56), psql: psqlFalso(bancos), log: silencio }),
    ).rejects.toThrow(/não existe/);
    expect(bancos.a.ensaios).toBe(0);
  });
});

describe("montarResumo", () => {
  it("o ensaio diz em letras que nada foi mudado", async () => {
    const r = await atualizarBancos({
      modo: "ensaiar",
      empresas: empresas("pneus-amigao", "loja-b"),
      migrations: migracoes(55, 56, 57),
      psql: psqlFalso({ "pneus-amigao": banco(56), "loja-b": banco(57) }),
      log: silencio,
    });
    const texto = montarResumo(r);
    expect(texto).toMatch(/Ensaio — nada foi mudado/);
    expect(texto).toMatch(/\| pneus-amigao \| 0056 \| 0057 \| ✅ passaria \|/);
    expect(texto).toMatch(/\| loja-b \| 0057 \| nada \| ✅ em dia \|/);
    expect(texto).toMatch(/O que as migrations avisaram/);
  });
});
