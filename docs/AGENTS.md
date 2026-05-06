# AGENTS.md

## Projeto

612 — Gestão residencial de energia

Sistema privado de gestão e rateio de energia residencial.

---

# Objetivo

Centralizar:
- faturas Celesc;
- leituras;
- fotos;
- rateios;
- pagamentos;
- histórico energético.

---

# Stack

- Next.js
- TypeScript
- Tailwind
- Supabase
- Recharts
- Lucide Icons

---

# Filosofia

Prioridades:
1. Confiabilidade
2. Clareza
3. Histórico
4. Simplicidade
5. Mobile-first

Evitar:
- overengineering;
- abstrações excessivas;
- arquitetura enterprise desnecessária.

---

# Regras críticas

- Competências fechadas não podem ser alteradas.
- Leituras exigem foto obrigatória.
- COSIP é dividida igualmente.
- Térrea é calculada automaticamente.
- Nunca usar FLOAT para cálculos financeiros.

---

# Fluxo operacional

1. Criar competência
2. Upload PDF Celesc
3. Registrar leituras
4. Calcular rateio
5. Gerar mini faturas
6. Registrar pagamentos
7. Fechar competência

---

# Organização

Sempre atualizar:
- TASKS.md
- CHANGELOG.md
- documentação relevante

O projeto deve ser facilmente continuável por outra IA.
