# 612 — Gestão residencial de energia

## Visão geral

612 é um sistema privado de gestão e rateio de energia residencial.

O sistema será utilizado por membros da família para:

- centralizar a fatura mensal da Celesc;
- registrar leituras dos medidores internos;
- armazenar fotos dos medidores;
- calcular automaticamente o rateio da energia;
- gerar mini faturas para envio aos inquilinos;
- acompanhar histórico de consumo e pagamentos;
- manter auditoria visual e financeira.

O sistema possui foco em:

- confiabilidade;
- histórico técnico;
- dashboard premium;
- mobile-first;
- dark mode minimalista.

---

# Filosofia do projeto

612 NÃO deve parecer:

- ERP antigo;
- painel administrativo genérico;
- sistema corporativo pesado.

612 deve parecer:

- sistema técnico premium;
- dashboard moderno;
- observatório energético residencial.

---

# Stack técnica

```txt
Next.js
TypeScript
Tailwind
Supabase
Recharts
Lucide Icons
```

---

# Estrutura principal

```txt
/app
/components
/lib
/types
/docs
```

---

# Banco de dados

```txt
profiles
residencias
competencias
faturas
leituras
rateios
pagamentos
audit_logs
```

---

# Fluxo operacional

1. Criar competência mensal
2. Upload da fatura Celesc
3. Registrar leituras com foto
4. Calcular consumos
5. Calcular rateio
6. Gerar mini faturas
7. Receber pagamentos
8. Fechar competência

---

# Design System

## Tipografia

- Geist Sans
- Geist Mono

## Estilo

- dark mode elegante
- radius baixo
- grid clean
- spacing generoso
- visual técnico minimalista

---

# Regras principais

- leitura sem foto não pode ser salva;
- competência fechada não pode ser alterada;
- COSIP dividida igualmente;
- térrea calculada automaticamente;
- cálculos usando DECIMAL/NUMERIC;
- histórico deve ser imutável após fechamento.

---

# Instruções para IA

Sempre atualizar:

```txt
TASKS.md
CHANGELOG.md
AGENTS.md
```

O projeto será desenvolvido utilizando:
- Claude Code
- OpenCode GO

A arquitetura deve permanecer:
- simples;
- pragmática;
- organizada;
- sem overengineering.
