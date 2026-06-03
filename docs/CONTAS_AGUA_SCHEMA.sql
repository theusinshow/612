-- Tabela para os 3 talões independentes de água.
-- Cada registro representa uma conta de uma matrícula/casa em um mês.

create table if not exists contas_agua (
  id uuid primary key default gen_random_uuid(),
  residencia_id uuid not null references residencias(id),
  matricula text not null,
  mes int not null check (mes between 1 and 12),
  ano int not null check (ano >= 2000),
  valor numeric(10, 2) not null check (valor >= 0),
  vencimento date,
  data_pagamento date,
  status text not null default 'pendente'
    check (status in ('pendente', 'pago', 'vencida')),
  responsavel_pagamento text not null default 'matheus'
    check (responsavel_pagamento in ('matheus', 'irmao')),
  arquivo_url text,
  observacoes text,
  created_at timestamptz not null default now(),
  unique (matricula, mes, ano)
);

alter table contas_agua enable row level security;

create policy "contas_agua_select_authenticated"
  on contas_agua for select
  to authenticated
  using (true);

create policy "contas_agua_insert_authenticated"
  on contas_agua for insert
  to authenticated
  with check (true);

create policy "contas_agua_update_authenticated"
  on contas_agua for update
  to authenticated
  using (true)
  with check (true);

create policy "contas_agua_delete_authenticated"
  on contas_agua for delete
  to authenticated
  using (true);

create index if not exists idx_contas_agua_competencia
  on contas_agua (ano desc, mes desc);

create index if not exists idx_contas_agua_residencia
  on contas_agua (residencia_id);

-- Storage: criar bucket público chamado "contas-agua" no Supabase.
-- Se preferir SQL:
insert into storage.buckets (id, name, public)
values ('contas-agua', 'contas-agua', true)
on conflict (id) do nothing;

create policy "contas_agua_storage_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'contas-agua');

create policy "contas_agua_storage_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'contas-agua');

create policy "contas_agua_storage_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'contas-agua')
  with check (bucket_id = 'contas-agua');
