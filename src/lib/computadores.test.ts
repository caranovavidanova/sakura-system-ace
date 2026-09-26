import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// A promessa de registrarEsteComputador(): contar ao banco quem é este
// computador SEM NUNCA atrapalhar o login. Um erro aqui não pode virar tela
// quebrada no balcão.

const rpc = vi.fn();
let apagadas: { id: string }[] = [];

vi.mock("./supabase", () => ({
  supabase: {
    rpc: (...args: unknown[]) => rpc(...args),
    from: () => {
      const q = {
        delete: () => q,
        eq: () => q,
        select: () => Promise.resolve({ data: apagadas, error: null }),
      };
      return q;
    },
  },
}));

const { esquecerComputador, registrarEsteComputador } = await import("./computadores");

const EU = {
  id: "3f1c2b9a-7d4e-4c1a-9b2f-0a1b2c3d4e5f",
  nomeMaquina: "DESKTOP-BALCAO",
  versao: "0.9.44",
  canal: "normal" as const,
  sistema: "Windows 11 Pro (10.0.22631)",
};

function comPonte(identidade: () => Promise<typeof EU>) {
  (globalThis as { window?: unknown }).window = {
    sakuraApp: { identidadeComputador: identidade },
  };
}

beforeEach(() => {
  rpc.mockReset();
  rpc.mockResolvedValue({ error: null });
  vi.stubEnv("DEV", false);
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  delete (globalThis as { window?: unknown }).window;
});

describe("registrarEsteComputador", () => {
  it("manda ao banco quem é o computador, a versão, o canal e a loja", async () => {
    comPonte(async () => EU);
    await registrarEsteComputador("loja-1");
    expect(rpc).toHaveBeenCalledWith("registrar_computador", {
      p_id: EU.id,
      p_nome_maquina: "DESKTOP-BALCAO",
      p_versao: "0.9.44",
      p_canal: "normal",
      p_sistema: "Windows 11 Pro (10.0.22631)",
      p_loja_id: "loja-1",
    });
  });

  it("em desenvolvimento não registra: o computador de quem programa não é da loja", async () => {
    vi.stubEnv("DEV", true);
    comPonte(async () => EU);
    await registrarEsteComputador("loja-1");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("fora do Electron (sem a ponte) não tenta nada", async () => {
    (globalThis as { window?: unknown }).window = {};
    await registrarEsteComputador("loja-1");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("banco sem a migration, ou sem rede: não lança — o login segue", async () => {
    comPonte(async () => EU);
    rpc.mockResolvedValue({ error: { code: "PGRST202", message: "function not found" } });
    await expect(registrarEsteComputador("loja-1")).resolves.toBeUndefined();

    rpc.mockRejectedValue(new Error("Failed to fetch"));
    await expect(registrarEsteComputador("loja-1")).resolves.toBeUndefined();
  });

  it("se a própria ponte falhar, também não lança", async () => {
    comPonte(async () => {
      throw new Error("IPC caiu");
    });
    await expect(registrarEsteComputador(null)).resolves.toBeUndefined();
    expect(rpc).not.toHaveBeenCalled();
  });
});

describe("esquecerComputador", () => {
  it("quando o banco apaga zero linhas, avisa em vez de fingir que esqueceu", async () => {
    apagadas = [];
    await expect(esquecerComputador("pc-1")).rejects.toThrow(/administrador/);
  });

  it("apagou a linha: segue sem erro", async () => {
    apagadas = [{ id: "pc-1" }];
    await expect(esquecerComputador("pc-1")).resolves.toBeUndefined();
  });
});
