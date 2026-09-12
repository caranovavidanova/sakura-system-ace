// A medição de contraste que roda DENTRO da página, pelo Playwright.
//
// Separada do resto porque é ela que faz o trabalho de verdade — e porque é o
// pedaço que precisa ser lido com cuidado se algum número parecer estranho.
//
// A regra é a WCAG 2.2: 4,5:1 pra texto normal, 3:1 pra texto grande
// (>= 24px, ou >= 18,66px em negrito) e 3:1 pra borda de campo de formulário
// e ícone informativo (critério 1.4.11).

export const MEDIR_CONTRASTE = () => {
  // --- cor ---------------------------------------------------------------
  // Quem lê a cor é o próprio navegador, desenhando num canvas de 1 pixel e
  // olhando o pixel que saiu.
  //
  // NÃO trocar isso por uma expressão regular que procura "rgb(...)": o
  // Tailwind v4 não devolve rgb. Toda cor com opacidade (`text-...-dark/80`,
  // `bg-black/40` — que é quase tudo neste app) chega aqui como
  // `oklab(0.89 0.026 -0.014 / 0.8)`. Uma regex de rgb não casa, devolve
  // "transparente", e a conta sai com letra e fundo IGUAIS: contraste 1:1 em
  // todas as 54 telas. Foi exatamente o que a primeira versão desta varredura
  // relatou — 183 reprovações, nenhuma verdadeira. O canvas entende oklab,
  // oklch, color-mix e o que mais vier, porque é o mesmo código que pinta a
  // tela de verdade.
  const tela = document.createElement("canvas");
  tela.width = 1;
  tela.height = 1;
  const pincel = tela.getContext("2d", { willReadFrequently: true });

  function parseCor(texto) {
    if (!texto) return { r: 0, g: 0, b: 0, a: 0 };
    pincel.clearRect(0, 0, 1, 1);
    // fillStyle inválido é IGNORADO pelo canvas (mantém o valor anterior), o
    // que faria uma cor desconhecida herdar a cor da medição passada. Marcar
    // com um valor conhecido antes deixa isso detectável.
    pincel.fillStyle = "#000000";
    pincel.fillStyle = texto;
    pincel.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = pincel.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  }

  function compor(frente, fundo) {
    const a = frente.a;
    return {
      r: frente.r * a + fundo.r * (1 - a),
      g: frente.g * a + fundo.g * (1 - a),
      b: frente.b * a + fundo.b * (1 - a),
      a: 1,
    };
  }

  function luminancia({ r, g, b }) {
    const canal = (v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  }

  function razao(c1, c2) {
    const l1 = luminancia(c1);
    const l2 = luminancia(c2);
    const [claro, escuro] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (claro + 0.05) / (escuro + 0.05);
  }

  const hex = ({ r, g, b }) =>
    "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

  /**
   * O fundo que a pessoa REALMENTE enxerga atrás daquele texto: sobe a árvore
   * empilhando cada fundo translúcido até achar um opaco, e compõe tudo de
   * trás pra frente.
   *
   * É isso que a varredura por `className` não consegue fazer, e é onde este
   * app se complica: quase toda tela fica dentro de um `sakura-card`, que é
   * um vidro (`background` com alfa + `backdrop-filter`). O blur em si não dá
   * pra calcular; o alfa dá, e é ele que decide a legibilidade.
   */
  function fundoEfetivo(elemento) {
    const camadas = [];
    let atual = elemento;
    while (atual) {
      const estilo = getComputedStyle(atual);
      const opacidade = parseFloat(estilo.opacity);
      const cor = parseCor(estilo.backgroundColor);
      const alfa = cor.a * (Number.isFinite(opacidade) ? opacidade : 1);
      if (alfa > 0) camadas.push({ ...cor, a: alfa });
      if (alfa >= 0.999) break;
      atual = atual.parentElement;
    }
    // Nada opaco até o topo: o navegador pinta branco por baixo de tudo.
    let fundo = { r: 255, g: 255, b: 255, a: 1 };
    for (const camada of camadas.reverse()) fundo = compor(camada, fundo);
    return fundo;
  }

  function visivel(elemento) {
    const estilo = getComputedStyle(elemento);
    if (estilo.visibility === "hidden" || estilo.display === "none") return false;
    if (parseFloat(estilo.opacity) === 0) return false;
    const caixa = elemento.getBoundingClientRect();
    return caixa.width > 0 && caixa.height > 0;
  }

  /** Quanto aquele texto precisa ter, pelo tamanho e peso da fonte. */
  function exigido(estilo) {
    const tamanho = parseFloat(estilo.fontSize);
    const peso = parseInt(estilo.fontWeight, 10) || 400;
    const grande = tamanho >= 24 || (tamanho >= 18.66 && peso >= 700);
    return grande ? 3 : 4.5;
  }

  function caminho(elemento) {
    const partes = [];
    let atual = elemento;
    for (let i = 0; atual && i < 3; i++) {
      const classes = (atual.getAttribute("class") ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 4)
        .join(".");
      partes.unshift(atual.tagName.toLowerCase() + (classes ? "." + classes : ""));
      atual = atual.parentElement;
    }
    return partes.join(" > ");
  }

  const achados = [];

  // --- texto -------------------------------------------------------------
  for (const elemento of document.querySelectorAll("body *")) {
    const proprio = [...elemento.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent.trim())
      .join(" ")
      .trim();
    if (proprio === "") continue;
    if (!visivel(elemento)) continue;

    const estilo = getComputedStyle(elemento);
    const fundo = fundoEfetivo(elemento);
    const frente = compor(parseCor(estilo.color), fundo);
    const medido = razao(frente, fundo);
    const minimo = exigido(estilo);
    if (medido >= minimo) continue;

    achados.push({
      tipo: "texto",
      caminho: caminho(elemento),
      amostra: proprio.slice(0, 60),
      frente: hex(frente),
      fundo: hex(fundo),
      tamanho: estilo.fontSize,
      peso: estilo.fontWeight,
      medido: Number(medido.toFixed(2)),
      minimo,
    });
  }

  // --- campos de formulário: texto digitado, marcador e BORDA -------------
  // A borda é o que diz onde o campo começa e termina. A WCAG 2.2 pede 3:1
  // pra ela (critério 1.4.11) justamente porque um campo cuja borda some vira
  // um retângulo invisível — e neste app a borda é `sakura-gray/40`, ou seja,
  // cinza escuro com 40% de opacidade sobre um card já escuro.
  for (const campo of document.querySelectorAll("input, select, textarea")) {
    if (!visivel(campo)) continue;
    const estilo = getComputedStyle(campo);
    const fundo = fundoEfetivo(campo);

    const texto = compor(parseCor(estilo.color), fundo);
    const medidoTexto = razao(texto, fundo);
    const minimoTexto = exigido(estilo);
    if (medidoTexto < minimoTexto) {
      achados.push({
        tipo: "campo (texto digitado)",
        caminho: caminho(campo),
        amostra: campo.getAttribute("name") ?? campo.type ?? "",
        frente: hex(texto),
        fundo: hex(fundo),
        tamanho: estilo.fontSize,
        peso: estilo.fontWeight,
        medido: Number(medidoTexto.toFixed(2)),
        minimo: minimoTexto,
      });
    }

    const larguraBorda = parseFloat(estilo.borderTopWidth);
    if (larguraBorda > 0) {
      // A borda é desenhada SOBRE o fundo do próprio campo, não sobre o do pai.
      const fundoDoCampo = compor(parseCor(estilo.backgroundColor), fundo);
      const borda = compor(parseCor(estilo.borderTopColor), fundoDoCampo);
      const medidoBorda = razao(borda, fundoDoCampo);
      if (medidoBorda < 3) {
        achados.push({
          tipo: "campo (borda)",
          caminho: caminho(campo),
          amostra: campo.getAttribute("name") ?? campo.type ?? "",
          frente: hex(borda),
          fundo: hex(fundoDoCampo),
          tamanho: estilo.borderTopWidth,
          peso: "-",
          medido: Number(medidoBorda.toFixed(2)),
          minimo: 3,
        });
      }
    }
  }

  return achados;
};
