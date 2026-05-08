# CHANGELOG.md

---

## [0.7.0] — 2026-05-08

### Reestilização visual — Premium UI / UX

Redesign completo da camada visual do sistema. Nenhuma regra de negócio alterada.

**Design system (`app/globals.css`):**
- Token `--color-text-muted` elevado de `#52525B` → `#71717A` (contraste WCAG 3.5:1+)
- Novos tokens: `--color-border-hover`, `--radius-lg`, `--duration-fast/base/slow`
- `@media (prefers-reduced-motion)` global para acessibilidade
- Classe utilitária `.focus-ring` com `outline: 2px solid accent` no `focus-visible`

**Layout shell:**
- Sidebar: ícone Zap em accent blue (#3B82F6), indicador `border-l-2` no item ativo, separador visual no footer, `aria-current="page"`, `aria-label`
- TopBar: título agora em `text-primary` (#FAFAFA), `backdrop-blur-sm`, Zap accent, `aria-label`
- BottomNav: active state com pill `bg-[#1A1A1A]`, `min-h-[44px]` (touch target WCAG), `aria-current`, `backdrop-blur-sm`
- LogoutButton: `duration-150`, `focus-ring`, `cursor-pointer`

**Core components:**
- Card: padding `p-4` → `p-5`; CardHeader com `font-semibold`
- MetricCard: padding `p-4` → `p-5`; icon box com tint accent `bg-[#3B82F6]/10`; hover state `hover:border-[#2A2A2A]`; sub text com contraste corrigido
- StatusBadge: padding `px-2 py-0.5` → `px-2.5 py-1` (mais presença)

**Páginas:**
- Dashboard: `gap-3` → `gap-4`, `mb-8` → `mb-10`, flow indicator com dots + ring semântico, hover nas linhas do histórico com `bg-[#1A1A1A]`, `focus-ring` nos links, contraste muted corrigido
- Login: form envolto em card container `rounded-[12px]`; logo com tint azul; inputs com `bg-[#1A1A1A]` + `focus:ring`; placeholder `#71717A`; botão com `active:scale-[0.98]`
- Competências: `cursor-pointer` explícito, `hover:border-[#2A2A2A]`, contraste muted, `mb-10`
- Analytics: `SummaryCard` inline removido → usa `MetricCard` com ícones (consistência entre páginas), `gap-4`

---

## [0.6.0] — 2026-05-06

### Analytics, Faturas e Residências

**Analytics (`/analytics`):**
- Gráficos Recharts com dados reais do Supabase
- Consumo mensal em kWh (bar chart)
- Valor da fatura por competência (line chart)
- Custo por residência empilhado (stacked bar)
- Cards de resumo: competências, média de consumo, média da fatura, total acumulado
- Tooltip dark mode customizado

**Faturas (`/faturas`):**
- Listagem real de todas as faturas históricas
- Cards de resumo: total de faturas, valor acumulado, consumo total
- Cada linha: competência, status, consumo, COSIP, vencimento, valor
- Ícone PDF quando há arquivo anexado
- Link direto para a competência correspondente

**Residências (`/residencias`):**
- Dados reais do Supabase (não mais estáticos)
- Campo `responsavel_nome` editável inline (ícone lápis → input → Enter/Esc)

**Dashboard:**
- Contador de pagamentos agora exclui a Térrea (2/2 em vez de 2/3)
- Indicador de dot no rateio apenas para residências inquilinas

---

## [0.5.0] — 2026-05-06

### Leitura unificada Res. 2 + Res. 3 e fluxo re-testado

- RegistrarLeiturasModal: Res. 2 e Res. 3 juntas, uma foto para ambas
- Auto-preenchimento da leitura anterior em paralelo
- Preview de consumo em tempo real por residência

---

## [0.4.0] — 2026-05-06

### Fluxo completo testado e corrigido

**Correções:**
- Mini fatura: busca pagamento separadamente (join PostgREST não funcionava)
- Página da competência: busca pagamentos separadamente via `.in("rateio_id", [...])`
- Botão "Marcar como pago" agora aparece corretamente
- Status real na mini fatura (Pendente → Pago após marcar)
- Re-fetch após garantirPagamentos para exibição imediata

**Fluxo validado end-to-end:**
1. Criar competência ✓
2. Cadastrar fatura ✓
3. Registrar leituras unificadas ✓
4. Calcular rateio ✓
5. Marcar pagamentos ✓
6. Mini fatura com status real ✓
7. Fechar competência ✓

---

## [0.3.0] — 2026-05-06

### Leitura unificada + Fechar competência + Mini faturas

**Leitura unificada:**
- RegistrarLeiturasModal: Res. 2 e Res. 3 juntas, uma foto para ambas
- Leituras lado a lado com auto-preenchimento em paralelo
- Preview de consumo em tempo real por residência

**Fechar competência:**
- FecharCompetenciaButton com modal de confirmação
- Valida pré-requisitos antes de fechar
- Log de auditoria ao fechar
- Competência fechada: botões somem, data de fechamento no header

**Mini faturas:**
- Página /competencias/[id]/mini-fatura/[residenciaId]
- Exibe medição, foto do medidor, composição, total, vencimento
- Botão "Copiar para WhatsApp" com texto formatado com emoji
- Status real (Pendente/Pago com data)

---

## [0.2.0] — 2026-05-06

### Supabase + Autenticação + Fluxo base

**Banco:** 8 tabelas, RLS, Storage, seed de residências
**Auth:** login/logout, middleware, callback
**Competências:** criar, listar, detalhe com progresso
**Fatura:** cadastrar com upload de PDF
**Leituras:** registrar com foto obrigatória
**Rateio:** engine de cálculo automático
**Pagamentos:** marcar como pago com data
**Dashboard:** dados reais, métricas, histórico

---

## [0.1.0] — 2026-05-06

### Estrutura inicial

Next.js + TypeScript + Tailwind + Supabase + Recharts + Lucide + Geist.
AppShell responsivo, design system dark mode, tipos TypeScript completos.

---

## Próximo milestone

- PWA para instalar no celular
