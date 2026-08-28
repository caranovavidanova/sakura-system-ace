// Dados 100% inventados pra gerar as imagens do site.
// Nenhum cliente, placa ou CPF de verdade da loja do pai dela.
const LOJA = "10000000-0000-0000-0000-000000000001";
const OP = "20000000-0000-0000-0000-000000000001";

const hoje = new Date();
const dia = (n) => {
  const d = new Date(hoje);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};
const diaCurto = (n) => dia(n).slice(0, 10);

export const lojas = [
  { id: LOJA, nome: "Auto Center Modelo", cidade: "Araraquara", uf: "SP", ativo: true, criado_em: dia(-400) },
];

export const operador = {
  id: OP, usuario: "demo", nome: "Marcos Andrade", admin: true,
  permissoes: [], ativo: true, deve_trocar_senha: false, criado_em: dia(-400),
};

const veiculos = [
  { id: "v1", cliente_id: "c1", placa: "RTA-4B71", marca: "Volkswagen", modelo: "Gol 1.6", ano: 2019, cor: "prata", tipo: "hatch", km_atual: 84210 },
  { id: "v2", cliente_id: "c2", placa: "QNS-1D02", marca: "Fiat", modelo: "Strada Freedom", ano: 2021, cor: "branco", tipo: "picape", km_atual: 51430 },
  { id: "v3", cliente_id: "c3", placa: "PVE-8H55", marca: "Chevrolet", modelo: "Onix LTZ", ano: 2022, cor: "preto", tipo: "sedan", km_atual: 33980 },
  { id: "v4", cliente_id: "c4", placa: "SBK-3C19", marca: "Jeep", modelo: "Renegade", ano: 2020, cor: "vermelho", tipo: "suv", km_atual: 67200 },
  { id: "v5", cliente_id: "c5", placa: "MJU-9F44", marca: "Honda", modelo: "CG 160 Fan", ano: 2023, cor: "azul", tipo: "moto", km_atual: 12750 },
];

export const clientes = [
  { id: "c1", nome: "Ricardo Menezes", tipo_pessoa: "fisica", cpf_cnpj: "123.456.789-00", telefone: "(16) 99000-1122", email: "ricardo@exemplo.com.br", cep: "14800-000", rua: "Rua das Acácias", numero: "215", bairro: "Centro", cidade: "Araraquara", uf: "SP", data_nascimento: "1985-04-12", criado_em: dia(-300) },
  { id: "c2", nome: "Transportes Boa Vista Ltda", tipo_pessoa: "juridica", cpf_cnpj: "12.345.678/0001-90", telefone: "(16) 3333-4455", email: "contato@exemplo.com.br", cep: "14802-100", rua: "Av. Industrial", numero: "1400", bairro: "Distrito Industrial", cidade: "Araraquara", uf: "SP", data_nascimento: null, criado_em: dia(-250) },
  { id: "c3", nome: "Juliana Prado", tipo_pessoa: "fisica", cpf_cnpj: "987.654.321-00", telefone: "(16) 98111-2233", email: "juliana@exemplo.com.br", cep: "14801-300", rua: "Rua Sete de Setembro", numero: "88", bairro: "Vila Xavier", cidade: "Araraquara", uf: "SP", data_nascimento: "1992-09-03", criado_em: dia(-180) },
  { id: "c4", nome: "Eduardo Salles", tipo_pessoa: "fisica", cpf_cnpj: "456.789.123-00", telefone: "(16) 99777-8899", email: "eduardo@exemplo.com.br", cep: "14803-200", rua: "Rua Padre Duarte", numero: "742", bairro: "Jardim Nova", cidade: "Araraquara", uf: "SP", data_nascimento: "1978-12-21", criado_em: dia(-120) },
  { id: "c5", nome: "Camila Rocha", tipo_pessoa: "fisica", cpf_cnpj: "321.654.987-00", telefone: "(16) 98222-3344", email: "camila@exemplo.com.br", cep: "14805-000", rua: "Rua Gonçalves Dias", numero: "56", bairro: "Santa Angelina", cidade: "Araraquara", uf: "SP", data_nascimento: "1996-06-30", criado_em: dia(-60) },
].map((c) => ({ ...c, veiculos: veiculos.filter((v) => v.cliente_id === c.id) }));

const vlk = (id) => veiculos.find((v) => v.id === id);
const item = (tipo, id, descricao, qtd, preco) => ({
  id: Math.random().toString(36).slice(2), tipo, descricao,
  quantidade: qtd, preco_unitario: preco, desconto: 0,
  peca_id: tipo === "peca" ? id : null, servico_id: tipo === "servico" ? id : null,
  tecnico: { nome: "Anderson Lima" },
});

export const ordens = [
  { numero: 148, cliente: "c1", veiculo: "v1", status: "em_andamento", abertura: -0.2,
    itens: [item("peca", "p1", "Pneu 175/70 R14", 2, 389.9), item("servico", "s1", "Alinhamento e balanceamento", 1, 120)] },
  { numero: 147, cliente: "c4", veiculo: "v4", status: "em_andamento", abertura: -0.6,
    itens: [item("peca", "p3", "Amortecedor dianteiro", 2, 445), item("servico", "s3", "Troca de amortecedor", 1, 260)] },
  { numero: 146, cliente: "c3", veiculo: "v3", status: "concluida", abertura: -1,
    itens: [item("peca", "p4", "Pastilha de freio dianteira", 1, 189.5), item("servico", "s4", "Troca de pastilha de freio", 1, 90)] },
  { numero: 145, cliente: "c2", veiculo: "v2", status: "faturada", abertura: -0.30,
    itens: [item("peca", "p2", "Pneu 205/60 R16", 4, 612), item("servico", "s1", "Alinhamento e balanceamento", 1, 140)] },
  { numero: 144, cliente: "c5", veiculo: "v5", status: "faturada", abertura: -0.55,
    itens: [item("servico", "s2", "Troca de óleo e filtro", 1, 165)] },
  { numero: 143, cliente: "c1", veiculo: "v1", status: "faturada", abertura: -0.80,
    itens: [item("peca", "p5", "Bateria 60Ah", 1, 549), item("servico", "s5", "Instalação de bateria", 1, 40)] },
].map((o) => {
  const cli = clientes.find((c) => c.id === o.cliente);
  const v = vlk(o.veiculo);
  return {
    id: "os" + o.numero, numero: o.numero, loja_id: LOJA,
    cliente_id: o.cliente, veiculo_id: o.veiculo,
    status: o.status, km_entrada: v.km_atual,
    descricao_problema: "", forma_pagamento: o.status === "faturada" ? "Pix" : null,
    parcelas: 1, data_abertura: dia(o.abertura),
    data_fechamento: o.status === "faturada" ? dia(o.abertura + 0.3) : null,
    vendedor_id: null, criado_por_id: OP, atualizado_por_id: OP,
    cliente: { nome: cli.nome },
    veiculo: { placa: v.placa, marca: v.marca, modelo: v.modelo, cor: v.cor, tipo: v.tipo },
    vendedor: { nome: "Marcos Andrade" },
    criado_por: { nome: "Marcos Andrade" },
    atualizado_por: { nome: "Marcos Andrade" },
    itens: o.itens,
  };
});

const totalOrdem = (o) =>
  o.itens.reduce((s, i) => s + i.quantidade * i.preco_unitario - i.desconto, 0);

// Movimento do mês inteiro, no tamanho de um autocenter de verdade:
// ~30 atendimentos no mês, ticket entre R$180 e R$2.400, mais as despesas
// operacionais que a loja realmente tem. Tudo inventado.
const TICKETS = [
  255, 550, 455, 480, 440, 225, 570, 460, 1080, 295,
  1095, 2580, 550, 1495, 635, 255, 1085, 270, 470, 880,
  210, 1135, 450, 820, 965, 755, 1900, 335, 850, 1990,
  575, 395, 355, 430, 1185, 465, 820, 360, 1095, 1540,
  1950, 1180, 340, 1195, 1980,
];
const DESPESAS = [
  ["Fornecedor de pneus", 9840],
  ["Folha de pagamento", 11200],
  ["Aluguel do galpão", 3200],
  ["Fornecedor de peças", 4630],
  ["Energia elétrica", 890],
  ["Internet e telefone", 240],
  ["Material de limpeza", 320],
  ["Manutenção de equipamento", 680],
];

const totalItens = (o) =>
  o.itens.reduce((s, i) => s + i.quantidade * i.preco_unitario - i.desconto, 0);

export const caixa = [
  // lançamentos de hoje, vindos das OS faturadas (mostram cliente e lucro)
  ...ordens.filter((o) => o.status === "faturada").map((o, i) => ({
    id: "cx-os" + o.numero, loja_id: LOJA, data: o.data_fechamento,
    ordem_servico_id: o.id, tipo: "entrada",
    forma_pagamento: ["Pix", "Cartão de crédito", "Dinheiro"][i % 3],
    valor: totalItens(o), descricao: "OS " + o.numero, categoria_id: null,
  })),
  ...TICKETS.map((valor, i) => ({
    id: "cx-e" + i, loja_id: LOJA, data: dia(-(1 + (i % 26))),
    ordem_servico_id: "os-hist-" + i, tipo: "entrada",
    forma_pagamento: ["Pix", "Cartão de crédito", "Dinheiro", "Cartão de débito"][i % 4],
    valor, descricao: "OS " + (118 + i), categoria_id: null,
  })),
  ...DESPESAS.map(([descricao, valor], i) => ({
    id: "cx-s" + i, loja_id: LOJA, data: dia(-(i * 3 + 1)),
    ordem_servico_id: null, tipo: "saida", forma_pagamento: "Transferência",
    valor, descricao, categoria_id: null,
  })),
];

export const contasPagar = [
  { id: "cp1", loja_id: LOJA, descricao: "Aluguel do galpão", valor: 3200, vencimento: diaCurto(4), categoria_id: null, recorrente: true, recorrente_ate: null, status: "pendente", data_pagamento: null, caixa_movimento_id: null, operador_id: OP, criado_em: dia(-30) },
  { id: "cp2", loja_id: LOJA, descricao: "Energia elétrica", valor: 890.4, vencimento: diaCurto(9), categoria_id: null, recorrente: true, recorrente_ate: null, status: "pendente", data_pagamento: null, caixa_movimento_id: null, operador_id: OP, criado_em: dia(-30) },
  { id: "cp3", loja_id: LOJA, descricao: "Fornecedor de pneus", valor: 4750, vencimento: diaCurto(-2), categoria_id: null, recorrente: false, recorrente_ate: null, status: "pendente", data_pagamento: null, caixa_movimento_id: null, operador_id: OP, criado_em: dia(-20) },
];

export const pecas = [
  { id: "p1", codigo_interno: "PN-17570R14", codigo_barras: "7891234567890", descricao: "Pneu 175/70 R14", marca: "Rovelo", modelo: "RHP-A68", aplicacao: "Gol, Onix, HB20", unidade: "UN", preco_custo: 245, preco_venda: 389.9, ncm: "40111000", cest: "", cfop_padrao: "5102", origem: "0", cst_ou_csosn: "500", aliquota_icms: 18, categoria_id: "cat1", prazo_garantia_dias: 90, ativo: true, criado_em: dia(-200) },
  { id: "p2", codigo_interno: "PN-20560R16", codigo_barras: "7891234567891", descricao: "Pneu 205/60 R16", marca: "Pirelli", modelo: "Cinturato P1", aplicacao: "Corolla, Civic, Cruze", unidade: "UN", preco_custo: 410, preco_venda: 612, ncm: "40111000", cest: "", cfop_padrao: "5102", origem: "0", cst_ou_csosn: "500", aliquota_icms: 18, categoria_id: "cat1", prazo_garantia_dias: 90, ativo: true, criado_em: dia(-200) },
  { id: "p3", codigo_interno: "AM-DIA-001", codigo_barras: "7891234567892", descricao: "Amortecedor dianteiro", marca: "Cofap", modelo: "GP32812", aplicacao: "Renegade, Compass", unidade: "UN", preco_custo: 298, preco_venda: 445, ncm: "87088000", cest: "", cfop_padrao: "5102", origem: "0", cst_ou_csosn: "500", aliquota_icms: 18, categoria_id: "cat2", prazo_garantia_dias: 180, ativo: true, criado_em: dia(-150) },
  { id: "p4", codigo_interno: "PF-DIA-220", codigo_barras: "7891234567893", descricao: "Pastilha de freio dianteira", marca: "Bosch", modelo: "BN1234", aplicacao: "Onix, Prisma", unidade: "JG", preco_custo: 121, preco_venda: 189.5, ncm: "87083090", cest: "", cfop_padrao: "5102", origem: "0", cst_ou_csosn: "500", aliquota_icms: 18, categoria_id: "cat3", prazo_garantia_dias: 90, ativo: true, criado_em: dia(-140) },
  { id: "p5", codigo_interno: "BT-60AH", codigo_barras: "7891234567894", descricao: "Bateria 60Ah", marca: "Moura", modelo: "M60GD", aplicacao: "Uso geral", unidade: "UN", preco_custo: 372, preco_venda: 549, ncm: "85071000", cest: "", cfop_padrao: "5102", origem: "0", cst_ou_csosn: "500", aliquota_icms: 18, categoria_id: "cat4", prazo_garantia_dias: 365, ativo: true, criado_em: dia(-90) },
];

export const servicos = [
  { id: "s1", codigo_interno: "SV-ALIN", descricao: "Alinhamento e balanceamento", preco_padrao: 120, custo: 35, categoria_id: null, ativo: true, criado_em: dia(-300) },
  { id: "s2", codigo_interno: "SV-TROCA-OLEO", descricao: "Troca de óleo e filtro", preco_padrao: 165, custo: 60, categoria_id: null, ativo: true, criado_em: dia(-300) },
  { id: "s3", codigo_interno: "SV-AMORT", descricao: "Troca de amortecedor", preco_padrao: 260, custo: 90, categoria_id: null, ativo: true, criado_em: dia(-300) },
  { id: "s4", codigo_interno: "SV-FREIO", descricao: "Troca de pastilha de freio", preco_padrao: 90, custo: 30, categoria_id: null, ativo: true, criado_em: dia(-300) },
  { id: "s5", codigo_interno: "SV-BAT", descricao: "Instalação de bateria", preco_padrao: 40, custo: 12, categoria_id: null, ativo: true, criado_em: dia(-300) },
];

export const categorias = [
  { id: "cat1", nome: "Pneus", criado_em: dia(-400) },
  { id: "cat2", nome: "Suspensão", criado_em: dia(-400) },
  { id: "cat3", nome: "Freios", criado_em: dia(-400) },
  { id: "cat4", nome: "Elétrica", criado_em: dia(-400) },
];

export const depositos = [{ id: "d1", loja_id: LOJA, nome: "Depósito Principal", ativo: true, criado_em: dia(-400) }];

export const estoque = [
  { id: "e1", loja_id: LOJA, deposito_id: "d1", peca_id: "p1", tipo: "entrada", quantidade: 24, motivo: "compra", referencia: "NF 88213", criado_em: dia(-20) },
  { id: "e2", loja_id: LOJA, deposito_id: "d1", peca_id: "p2", tipo: "entrada", quantidade: 16, motivo: "compra", referencia: "NF 88213", criado_em: dia(-20) },
  { id: "e3", loja_id: LOJA, deposito_id: "d1", peca_id: "p1", tipo: "saida", quantidade: 2, motivo: "uso_em_os", referencia: "OS 148", criado_em: dia(-0.2) },
  { id: "e4", loja_id: LOJA, deposito_id: "d1", peca_id: "p5", tipo: "entrada", quantidade: 12, motivo: "compra", referencia: "NF 88410", criado_em: dia(-12) },
  { id: "e5", loja_id: LOJA, deposito_id: "d1", peca_id: "p3", tipo: "entrada", quantidade: 10, motivo: "compra", referencia: "NF 88410", criado_em: dia(-12) },
  { id: "e6", loja_id: LOJA, deposito_id: "d1", peca_id: "p4", tipo: "entrada", quantidade: 14, motivo: "compra", referencia: "NF 88555", criado_em: dia(-8) },
  { id: "e7", loja_id: LOJA, deposito_id: "d1", peca_id: "p3", tipo: "saida", quantidade: 2, motivo: "uso_em_os", referencia: "OS 147", criado_em: dia(-0.6) },
  { id: "e8", loja_id: LOJA, deposito_id: "d1", peca_id: "p4", tipo: "saida", quantidade: 1, motivo: "uso_em_os", referencia: "OS 146", criado_em: dia(-1) },
  { id: "e9", loja_id: LOJA, deposito_id: "d1", peca_id: "p2", tipo: "saida", quantidade: 4, motivo: "uso_em_os", referencia: "OS 145", criado_em: dia(-0.3) },
];

export const TABELAS = {
  lojas, clientes, veiculos, pecas, servicos, depositos,
  ordens_servico: ordens,
  caixa_movimentos: caixa,
  contas_pagar: contasPagar,
  estoque_movimentos: estoque,
  operadores: [operador],
  operador_lojas: [{ operador_id: OP, loja_id: LOJA, loja: lojas[0] }],
  configuracoes_painel_inicio: [{ loja_id: LOJA, cartoes: ["vendas_mes", "lucro_mes", "ticket_medio_mes"] }],
  contas_receber: [], notas_fiscais_arquivos: [], fornecedores: [],
  pedidos_compra: [], cotacoes_pecas: [], contagens_estoque: [],
  categorias, categorias_servicos: [], categorias_caixa: [],
  funcionarios: [{ id: "f1", loja_id: LOJA, nome: "Anderson Lima", cargo: "Mecânico", ativo: true, operador_id: null, criado_em: dia(-300) }],
  auditoria: [], configuracoes_garantia: [], configuracoes_fiscais_loja: [],
  configuracoes_juros_parcelas: [], funcionario_filhos: [], ordens_servico_itens: [],
  pedidos_compra_itens: [],
};

export const SESSAO = {
  access_token: "demo-access-token", token_type: "bearer", expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "demo-refresh-token",
  user: {
    id: OP, aud: "authenticated", role: "authenticated", email: "demo@sakura.local",
    email_confirmed_at: dia(-400), phone: "", confirmed_at: dia(-400),
    last_sign_in_at: dia(0), app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {}, identities: [], created_at: dia(-400), updated_at: dia(0),
  },
};
