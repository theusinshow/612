# TASKS.md

## Setup

- [x] Criar projeto Next.js com TypeScript, Tailwind, App Router
- [x] Instalar dependências: Supabase, Recharts, Lucide React, Geist
- [x] Configurar Tailwind com design system 612
- [x] Configurar Geist Font no layout raiz
- [ ] Configurar Supabase (criar projeto, adicionar .env.local)

---

## Estrutura base

- [x] Criar AppShell (layout com sidebar + bottom nav)
- [x] Criar Sidebar (desktop, nav principal)
- [x] Criar BottomNav (mobile)
- [x] Criar TopBar (mobile)
- [x] Criar Card + CardHeader
- [x] Criar StatusBadge
- [x] Criar MetricCard
- [x] Criar tipos TypeScript (types/index.ts)
- [x] Criar lib/supabase/client.ts
- [x] Criar lib/supabase/server.ts
- [x] Criar lib/utils.ts

---

## Páginas base

- [x] /dashboard (placeholder com métricas)
- [x] /competencias (placeholder)
- [x] /residencias (listagem estática)
- [x] /faturas (placeholder)
- [x] /analytics (placeholder)
- [x] /configuracoes (placeholder)

---

## Banco de dados

- [ ] Criar tabela profiles
- [ ] Criar tabela residencias (seed: Térrea, Res. 2, Res. 3)
- [ ] Criar tabela competencias
- [ ] Criar tabela faturas
- [ ] Criar tabela leituras
- [ ] Criar tabela rateios
- [ ] Criar tabela pagamentos
- [ ] Criar tabela audit_logs
- [ ] Configurar Row Level Security (RLS)
- [ ] Configurar Storage buckets (pdfs, fotos-leituras)

---

## Autenticação

- [ ] Configurar Supabase Auth
- [ ] Criar página /login
- [ ] Criar middleware de autenticação
- [ ] Proteger rotas autenticadas

---

## Funcionalidades principais

- [ ] Criar competência mensal
- [ ] Upload de PDF da fatura Celesc
- [ ] Registrar leitura com foto obrigatória
- [ ] Engine de cálculo de rateio
- [ ] Gerar mini faturas
- [ ] Registrar pagamentos (PIX)
- [ ] Fechar competência (snapshot imutável)

---

## Dashboard

- [ ] DashboardHero com competência atual
- [ ] MetricCards com dados reais do Supabase
- [ ] ResidenceOverviewGrid com rateio
- [ ] Gráfico de consumo histórico (Recharts)

---

## Analytics

- [ ] ConsumptionChart
- [ ] CostChart
- [ ] MonthlyComparisonChart

---

## Próximo passo recomendado

Configurar Supabase:
1. Criar projeto em supabase.com
2. Copiar URL e ANON_KEY para .env.local
3. Criar tabelas via SQL (ver DATABASE_SCHEMA.md)
