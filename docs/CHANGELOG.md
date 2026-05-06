# CHANGELOG.md

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
- Scrollbar customizada

**Componentes criados:**
- `components/layout/AppShell.tsx` — shell principal responsivo
- `components/layout/Sidebar.tsx` — sidebar desktop com nav
- `components/layout/BottomNav.tsx` — bottom nav mobile
- `components/layout/TopBar.tsx` — top bar mobile
- `components/ui/Card.tsx` + `CardHeader`
- `components/ui/StatusBadge.tsx`
- `components/ui/MetricCard.tsx`

**Lib criada:**
- `lib/supabase/client.ts` — cliente browser (SSR-safe)
- `lib/supabase/server.ts` — cliente server (SSR)
- `lib/utils.ts` — formatCurrency, formatKwh, formatCompetencia, cn

**Tipos criados:**
- `types/index.ts` — todos os tipos do banco de dados

**Páginas placeholder criadas:**
- `/dashboard` — métricas estáticas, cards de rateio
- `/competencias` — placeholder
- `/residencias` — listagem estática das 3 residências
- `/faturas` — placeholder
- `/analytics` — placeholder
- `/configuracoes` — placeholder

**Documentação:**
- Definidos regras de negócio, engine de cálculo, arquitetura visual
- Design system, modelagem do banco, fluxo operacional, stack técnica

---

## Próximo milestone: Supabase + Auth

- Configurar projeto Supabase
- Criar tabelas via SQL
- Implementar autenticação
- Conectar dashboard com dados reais
