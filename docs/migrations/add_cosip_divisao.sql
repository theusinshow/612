-- Divisão do COSIP por competência
-- 3 = padrão (cada residência paga cosip/3)
-- 2 = irmão nas duas de cima (térrea paga cosip/2; Res. 2 e Res. 3 pagam cosip/4 cada)
alter table faturas
  add column if not exists cosip_divisao smallint not null default 3;

alter table faturas
  add constraint faturas_cosip_divisao_chk check (cosip_divisao in (2, 3));
