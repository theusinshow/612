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

- [x] /dashboard (dados reais do Supabase)
- [x] /competencias (listagem com status)
- [x] /competencias/[id] (detalhe completo)
- [x] /competencias/[id]/mini-fatura/[residenciaId]
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

## Fluxo principal (completo e testado)

- [x] Criar competência mensal
- [x] Cadastrar fatura Celesc (valor, consumo, COSIP, vencimento, PDF)
- [x] Registrar leituras unificadas Res. 2 + Res. 3 (uma foto, dois campos)
- [x] Auto-preenchimento da leitura anterior (busca competência anterior)
- [x] Engine de cálculo de rateio (térrea automática, COSIP dividida)
- [x] Marcar pagamentos como pago (com data)
- [x] Mini faturas por residência com status real
- [x] Copiar mini fatura para WhatsApp
- [x] Fechar competência (snapshot imutável + log de auditoria)

---

## Dashboard

- [x] Métricas reais (consumo, valor, pagamentos, histórico)
- [x] Competência atual com progresso do fluxo
- [x] Rateio com status de pagamento por residência
- [x] Histórico de competências com link direto

---

## Próximas features

- [x] Gráfico de consumo histórico (Recharts) na página de analytics
- [x] Responsável por residência editável
- [x] Página /faturas com listagem de todas as faturas
- [x] Reestilização visual premium (v0.7.0)
- [ ] PWA (instalar no celular)
- [x] Leitura unificada Res. 2 + Res. 3 com foto compartilhada
