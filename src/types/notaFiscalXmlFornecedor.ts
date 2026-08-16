// Item extraído do XML da nota fiscal (NFe) que o fornecedor emitiu — não
// confundir com src/types/itemNotaFiscal.ts, que é o item extraído por IA a
// partir de foto/PDF em Estoque → "Importar por foto".
export interface ItemNotaFiscalXml {
  codigo_barras: string | null;
  codigo_interno_xml: string | null;
  descricao: string;
  ncm: string | null;
  cfop_padrao: string | null;
  unidade: string | null;
  quantidade: number;
  preco_unitario: number;
  origem: string | null;
  cst_ou_csosn: string | null;
  aliquota_icms: number | null;
}

export interface NotaFiscalXmlExtraida {
  fornecedor_cnpj: string | null;
  fornecedor_nome: string | null;
  numero: string | null;
  itens: ItemNotaFiscalXml[];
}
