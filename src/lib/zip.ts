// Montagem de arquivo .zip sem biblioteca externa.
//
// Por que à mão: os XMLs de nota fiscal são arquivos pequenos (alguns KB cada),
// então guardar sem compressão ("stored") não faz diferença prática no tamanho
// do arquivo final — e evita puxar uma dependência nova só pra isso, no mesmo
// espírito dos gráficos em SVG puro e da leitura de XML com DOMParser.
//
// O formato escrito aqui é o clássico: um "cabeçalho local + conteúdo" por
// arquivo, seguido de um índice ("diretório central") no fim, que é por onde
// todo descompactador começa a ler.

const ASSINATURA_CABECALHO_LOCAL = 0x04034b50;
const ASSINATURA_DIRETORIO_CENTRAL = 0x02014b50;
const ASSINATURA_FIM_DIRETORIO = 0x06054b50;

// Bit 11 avisa que o nome do arquivo está em UTF-8 — sem isso, nome com
// acento sai errado no Windows.
const FLAG_NOME_UTF8 = 0x0800;
const SEM_COMPRESSAO = 0;
const VERSAO_MINIMA = 20;

export interface ArquivoParaZip {
  nome: string;
  conteudo: Uint8Array;
}

const TABELA_CRC32 = (() => {
  const tabela = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let valor = i;
    for (let bit = 0; bit < 8; bit += 1) {
      valor = valor & 1 ? 0xedb88320 ^ (valor >>> 1) : valor >>> 1;
    }
    tabela[i] = valor >>> 0;
  }
  return tabela;
})();

export function crc32(dados: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < dados.length; i += 1) {
    crc = TABELA_CRC32[(crc ^ dados[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// O .zip guarda data/hora no formato do MS-DOS (dos anos 80): a hora cabe em
// 2 bytes, com o segundo dividido por 2, e o ano é contado a partir de 1980.
function horaDos(data: Date): number {
  return (data.getHours() << 11) | (data.getMinutes() << 5) | (data.getSeconds() >> 1);
}

function dataDos(data: Date): number {
  const ano = Math.max(data.getFullYear() - 1980, 0);
  return (ano << 9) | ((data.getMonth() + 1) << 5) | data.getDate();
}

// Dois arquivos com o mesmo nome dentro de um .zip deixam o descompactador
// perguntar "substituir?" ou simplesmente perder um dos dois — como o nome do
// XML vem do que foi enviado, repetição é possível ("nota.xml" duas vezes).
export function nomesSemRepetir(nomes: string[]): string[] {
  const usados = new Map<string, number>();
  return nomes.map((nome) => {
    const chave = nome.toLowerCase();
    const vezes = usados.get(chave) ?? 0;
    usados.set(chave, vezes + 1);
    if (vezes === 0) return nome;

    const ponto = nome.lastIndexOf(".");
    return ponto > 0
      ? `${nome.slice(0, ponto)} (${vezes + 1})${nome.slice(ponto)}`
      : `${nome} (${vezes + 1})`;
  });
}

export function criarZip(arquivos: ArquivoParaZip[], agora = new Date()): Blob {
  const nomes = nomesSemRepetir(arquivos.map((arquivo) => arquivo.nome));
  const codificador = new TextEncoder();
  const hora = horaDos(agora);
  const dia = dataDos(agora);

  const partes: Uint8Array[] = [];
  const entradasDoIndice: Uint8Array[] = [];
  let deslocamento = 0;

  arquivos.forEach((arquivo, indice) => {
    const nome = codificador.encode(nomes[indice]);
    const verificacao = crc32(arquivo.conteudo);
    const tamanho = arquivo.conteudo.length;

    const cabecalho = new DataView(new ArrayBuffer(30));
    cabecalho.setUint32(0, ASSINATURA_CABECALHO_LOCAL, true);
    cabecalho.setUint16(4, VERSAO_MINIMA, true);
    cabecalho.setUint16(6, FLAG_NOME_UTF8, true);
    cabecalho.setUint16(8, SEM_COMPRESSAO, true);
    cabecalho.setUint16(10, hora, true);
    cabecalho.setUint16(12, dia, true);
    cabecalho.setUint32(14, verificacao, true);
    cabecalho.setUint32(18, tamanho, true);
    cabecalho.setUint32(22, tamanho, true);
    cabecalho.setUint16(26, nome.length, true);
    cabecalho.setUint16(28, 0, true);

    partes.push(new Uint8Array(cabecalho.buffer), nome, arquivo.conteudo);

    const entrada = new DataView(new ArrayBuffer(46));
    entrada.setUint32(0, ASSINATURA_DIRETORIO_CENTRAL, true);
    entrada.setUint16(4, VERSAO_MINIMA, true);
    entrada.setUint16(6, VERSAO_MINIMA, true);
    entrada.setUint16(8, FLAG_NOME_UTF8, true);
    entrada.setUint16(10, SEM_COMPRESSAO, true);
    entrada.setUint16(12, hora, true);
    entrada.setUint16(14, dia, true);
    entrada.setUint32(16, verificacao, true);
    entrada.setUint32(20, tamanho, true);
    entrada.setUint32(24, tamanho, true);
    entrada.setUint16(28, nome.length, true);
    entrada.setUint16(30, 0, true);
    entrada.setUint16(32, 0, true);
    entrada.setUint16(34, 0, true);
    entrada.setUint16(36, 0, true);
    entrada.setUint32(38, 0, true);
    entrada.setUint32(42, deslocamento, true);

    entradasDoIndice.push(new Uint8Array(entrada.buffer), nome);
    deslocamento += 30 + nome.length + tamanho;
  });

  const inicioDoIndice = deslocamento;
  const tamanhoDoIndice = entradasDoIndice.reduce((soma, parte) => soma + parte.length, 0);

  const fim = new DataView(new ArrayBuffer(22));
  fim.setUint32(0, ASSINATURA_FIM_DIRETORIO, true);
  fim.setUint16(4, 0, true);
  fim.setUint16(6, 0, true);
  fim.setUint16(8, arquivos.length, true);
  fim.setUint16(10, arquivos.length, true);
  fim.setUint32(12, tamanhoDoIndice, true);
  fim.setUint32(16, inicioDoIndice, true);
  fim.setUint16(20, 0, true);

  const blocos = [...partes, ...entradasDoIndice, new Uint8Array(fim.buffer)];
  const completo = new Uint8Array(blocos.reduce((soma, bloco) => soma + bloco.length, 0));
  let posicao = 0;
  for (const bloco of blocos) {
    completo.set(bloco, posicao);
    posicao += bloco.length;
  }

  return new Blob([completo], { type: "application/zip" });
}
