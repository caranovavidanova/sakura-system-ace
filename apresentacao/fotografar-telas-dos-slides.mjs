// Tira as fotos das telas usadas na apresentação comercial em slides: só a
// área principal (sem o menu lateral), com o recorte de cada uma. Os dados são
// os inventados de site/ferramentas/dados-demo.mjs (a loja "Auto Center
// Modelo"), então nenhuma foto mostra cliente de verdade.
//
// Uso (a partir da raiz do repositório, com o .env de mentira que o
// percorrer-telas.mjs pede e o vite das ferramentas já no ar):
//   npx vite --config site/ferramentas/vite.telas.config.ts
//   node apresentacao/fotografar-telas-dos-slides.mjs <pasta-de-saida>
//
// Duas telas recebem ajuste antes da foto:
// - Início: o aviso da alíquota da prefeitura é tirado da tela. Na loja ele
//   some sozinho depois de "Já cadastrei"; o banco de mentira não guarda essa
//   confirmação.
// - Faturamento: o pagamento é dividido entre Pix e cartão em 3x, pra mostrar
//   o parcelamento com juros só na parte do cartão.
//
// Duas pegadinhas dos dados de exemplo (PROJETO_STATUS.md, marco de 25/09/2026):
// o banco de mentira não filtra as notas fiscais por OS, então o recorte do
// Fechamento para antes da linha de "Ver DANFE" repetida; e o Caixa Diário de
// hoje sai com lucro igual à venda, por isso ele não está na lista.
import { mkdirSync } from "node:fs";
import { percorrerTelas } from "../site/ferramentas/percorrer-telas.mjs";

const SAIDA = process.argv[2] || "/tmp/telas-dos-slides";
mkdirSync(SAIDA, { recursive: true });

// Tela → ajuste antes da foto (null = nenhum).
const QUERO = {
  "04-inicio": async (p) => {
    await p.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find(
        (x) => x.textContent.trim() === "Já cadastrei",
      );
      b?.closest("div.bg-amber-50")?.remove();
    });
    await p.waitForTimeout(600);
  },
  "07-ordens": null,
  "09-os-faturamento": async (p) => {
    await p.getByText("Dividir em mais de uma forma de pagamento").click();
    await p.waitForTimeout(600);
    const valores = p.locator('input[type="number"]:visible');
    await valores.nth(0).fill("400");
    await valores.nth(1).fill("499.8");
    await p.locator("select:visible").nth(3).selectOption({ index: 2 });
    await p.waitForTimeout(800);
  },
  "10-os-fechamento": null,
  "11-estoque-produtos": null,
  "20-pedidos-compra": null,
  "33-contas-receber": null,
  "37-lucratividade": null,
  "46-comissoes": null,
};

// Tela → [topo, altura] do recorte, dentro da área principal (1312px de largura).
const RECORTE = {
  "04-inicio": [0, 755],
  "07-ordens": [0, 710],
  "09-os-faturamento": [96, 480],
  "10-os-fechamento": [96, 615],
  "11-estoque-produtos": [0, 610],
  "20-pedidos-compra": [0, 460],
  "33-contas-receber": [0, 580],
  "37-lucratividade": [0, 880],
  "46-comissoes": [0, 680],
};

const { falhas } = await percorrerTelas(async (cena, pagina) => {
  if (!(cena.arquivo in QUERO)) return;
  const ajuste = QUERO[cena.arquivo];
  if (ajuste) await ajuste(pagina);
  const [y, altura] = RECORTE[cena.arquivo];
  await pagina.screenshot({
    path: `${SAIDA}/${cena.arquivo}.png`,
    clip: { x: 288, y, width: 1312, height: altura },
  });
});

console.log(`\nFotos dos slides em ${SAIDA}`);
if (falhas.length) console.log("falharam:", falhas.map(([a]) => a).join(", "));
