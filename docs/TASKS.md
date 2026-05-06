# TASKS.md

## Setup

- [x] Criar projeto Next.js com TypeScript, Tailwind, App Router
- [x] Instalar dependências: Supabase, Recharts, Lucide React, Geist
- [x] Configurar Tailwind com design system 612
- [x] Configurar Geist Font no layout raiz
- [x] Configurar Supabase (projeto criado, .env.local configurado)

---

## Estrutura base

- [x] Criar AppShell (layout com sidebar + bottom nav)
- [x] Criar Sidebar (desktop, nav principal + logout)
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
- [x] /login

---

## Banco de dados

- [x] Criar tabela profiles (com trigger auto-create)
- [x] Criar tabela residencias (seed: Térrea, Res. 2, Res. 3)
- [x] Criar tabela competencias
- [x] Criar tabela faturas
- [x] Criar tabela leituras
- [x] Criar tabela rateios
- [x] Criar tabela pagamentos
- [x] Criar tabela audit_logs
- [x] Configurar Row Level Security (RLS)
- [x] Configurar Storage buckets (faturas-pdf, fotos-leituras)

---

## Autenticação

- [x] Configurar Supabase Auth (email/senha, sem confirmação)
- [x] Criar página /login
- [x] Criar middleware de autenticação (proteção de rotas)
- [x] Proteger rotas autenticadas
- [x] Criar rota /auth/callback
- [x] Criar LogoutButton

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

Implementar fluxo de competências:
1. Criar competência mensal (formulário)
2. Upload da fatura Celesc (PDF)
3. Registrar leituras com foto
