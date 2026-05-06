# CHANGELOG.md

---

## [0.2.0] — 2026-05-06

### Supabase + Autenticação

**Banco de dados criado:**
- 8 tabelas: profiles, residencias, competencias, faturas, leituras, rateios, pagamentos, audit_logs
- Tipos corretos: NUMERIC(10,2) para valores financeiros (nunca FLOAT)
- consumo_calculado e valor_total como colunas geradas (GENERATED ALWAYS AS)
- Constraints de integridade: leitura não negativa, competência única por mes/ano
- Trigger `handle_new_user` — cria profile automaticamente ao registrar usuário
- RLS habilitado em todas as tabelas
- Storage buckets: faturas-pdf e fotos-leituras (privados)
- Seed: 3 residências (Térrea, Residência 2, Residência 3)

**Autenticação implementada:**
- `middleware.ts` — protege todas as rotas, redireciona para /login se não autenticado
- `app/login/page.tsx` + `LoginForm.tsx` — página de login com design system 612
- `app/auth/callback/route.ts` — callback OAuth
- `components/layout/LogoutButton.tsx` — logout na sidebar
- Supabase Auth configurado (email/senha, sem confirmação de email)

---

## [0.1.0] — 2026-05-06

### Estrutura inicial criada

**Projeto Next.js inicializado:**
- Next.js com App Router, TypeScript, Tailwind CSS, ESLint
- Alias `@/*` configurado
- Geist Font configurada no layout raiz
- Dark mode forçado (#0A0A0A base)

**Dependências instaladas:**
- `@supabase/supabase-js` + `@supabase/ssr`
- `recharts`
- `lucide-react`
- `geist`

**Design system configurado (globals.css):**
- Paleta: bg-base #0A0A0A, card #111111, elevated #1A1A1A
- Texto: #FAFAFA (primary), #A1A1AA (secondary), #52525B (muted)
- Radius: 6px–8px

**Componentes criados:**
- AppShell, Sidebar, BottomNav, TopBar
- Card, MetricCard, StatusBadge

**Lib + Tipos:**
- lib/supabase/client.ts, server.ts
- lib/utils.ts
- types/index.ts

**Páginas placeholder:**
- /dashboard, /competencias, /residencias, /faturas, /analytics, /configuracoes

---

## Próximo milestone: Fluxo de competências

- Criar competência mensal (formulário)
- Upload da fatura Celesc (PDF → Supabase Storage)
- Registrar leituras com foto obrigatória
