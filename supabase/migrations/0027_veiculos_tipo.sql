-- Sakura System — AutoCenter Edition
-- Migration 0027: tipo de veículo (usado pra escolher o ícone certo na seção
-- "Veículos no pátio" do Início). Conjunto simplificado de propósito — carro
-- em 4 carrocerias (hatch/sedã/SUV/picape) + moto como um ícone só (a
-- usuária confirmou que não vale a pena detalhar tipos de moto, já que quase
-- não aparece moto na borracharia). Nenhum veículo já cadastrado quebra:
-- coluna opcional, sem valor default forçado (fica null até alguém escolher
-- ao editar/cadastrar de novo).
-- Idempotente: seguro rodar de novo.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'veiculos' and column_name = 'tipo'
  ) then
    alter table veiculos add column tipo text;
  end if;
end $$;

alter table veiculos drop constraint if exists veiculos_tipo_check;
alter table veiculos add constraint veiculos_tipo_check
  check (tipo is null or tipo in ('hatch', 'sedan', 'suv', 'picape', 'moto'));
