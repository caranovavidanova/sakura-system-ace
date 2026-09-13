/**
 * Entrega um arquivo pronto pra pessoa salvar.
 *
 * Fica separado porque dois lugares diferentes precisam disso (os XMLs de
 * nota fiscal e o pacote de diagnóstico) e a mecânica é sempre a mesma:
 * transformar o conteúdo em endereço temporário, clicar num link invisível,
 * e devolver o endereço logo em seguida pra não segurar memória à toa.
 */
export function salvarComoDownload(conteudo: Blob, nomeArquivo: string): void {
  const url = URL.createObjectURL(conteudo);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}
