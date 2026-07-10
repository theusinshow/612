-- Índices de performance para as colunas mais filtradas (.eq / .in).
-- Idempotente: "if not exists" evita erro se já existir.
--
-- OBS: muitas destas colunas provavelmente JÁ possuem índice, criado
-- implicitamente pelas constraints UNIQUE usadas nos upserts (onConflict):
--   faturas(competencia_id), leituras(competencia_id, residencia_id),
--   rateios(competencia_id, residencia_id), pagamentos(rateio_id).
-- Rodar mesmo assim é seguro; no máximo é no-op.
--
-- Para inspecionar os índices atuais antes de rodar:
--   select tablename, indexname, indexdef
--   from pg_indexes where schemaname = 'public' order by tablename;

create index if not exists idx_faturas_competencia
  on faturas (competencia_id);

create index if not exists idx_leituras_competencia
  on leituras (competencia_id);

create index if not exists idx_rateios_competencia
  on rateios (competencia_id);

create index if not exists idx_pagamentos_rateio
  on pagamentos (rateio_id);

-- Usado na ordenação do dashboard/competências e em buscarLeituraAnterior.
create index if not exists idx_competencias_ano_mes
  on competencias (ano, mes);

-- Usado nas consultas de contas de água por residência.
create index if not exists idx_contas_agua_residencia
  on contas_agua (residencia_id);
