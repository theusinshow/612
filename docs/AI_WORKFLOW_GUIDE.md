# AI_WORKFLOW_GUIDE.md

# Objetivo

Este documento define:
- padrões de prompts;
- boas práticas;
- fluxo operacional;
- manutenção de contexto;
- organização de sessões;

para desenvolvimento do projeto 612 utilizando:
- Claude Code;
- OpenCode GO;
- múltiplas IAs;
- múltiplas sessões.

---

# Filosofia de desenvolvimento

Prioridades:

1. Clareza
2. Confiabilidade
3. Simplicidade
4. Consistência
5. Continuidade entre IAs

Evitar:
- overengineering;
- arquitetura enterprise;
- abstrações excessivas;
- prompts vagos;
- múltiplas features gigantes em uma única sessão.

---

# Regra principal

Nunca pedir:

```txt
faz tudo
```

Sempre trabalhar:
- uma feature por vez;
- uma tela por vez;
- um fluxo por vez.

---

# Fluxo ideal de sessão

## 1. Contexto

Primeiro:
- ler documentação;
- entender arquitetura;
- entender regras.

Nunca começar implementando diretamente.

---

## 2. Planejamento

Antes de codar:
- explicar rapidamente o plano;
- listar arquivos que serão alterados;
- apontar possíveis impactos.

---

## 3. Implementação

Implementar:
- simples;
- consistente;
- reutilizável;
- alinhado ao design system.

---

## 4. Encerramento

Sempre:
- atualizar documentação;
- atualizar changelog;
- atualizar tasks;
- registrar próximos passos.

---

# Prompt de contexto

Usar no início de sessões novas.

```md
Leia:
- AGENTS.md
- documentação dentro de /docs

Entenda:
- regras de negócio;
- arquitetura visual;
- stack;
- filosofia do projeto.

Depois me explique:
1. como o sistema funciona;
2. quais são as regras críticas;
3. quais arquivos serão mais importantes para a tarefa atual.

Não implemente nada ainda.
```

---

# Prompt de implementação

```md
Implemente a feature X seguindo:

- arquitetura atual do projeto;
- design system definido;
- componentização existente;
- filosofia visual do 612;
- mobile-first;
- dark mode minimalista.

Regras:
- não criar abstrações desnecessárias;
- não duplicar componentes;
- reutilizar componentes existentes;
- manter consistência visual;
- usar TypeScript corretamente;
- manter código simples e legível.

Antes de implementar:
- analise componentes existentes;
- explique o plano rapidamente.

Após implementar:
- atualize TASKS.md e CHANGELOG.md.
```

---

# Prompt de refatoração

```md
Analise os arquivos alterados recentemente.

Objetivos:
- reduzir duplicação;
- melhorar clareza;
- simplificar arquitetura;
- manter consistência visual;
- evitar overengineering.

Não altere comportamento do sistema.

Explique:
- o problema atual;
- a solução proposta;
- os impactos.

Depois implemente cuidadosamente.
```

---

# Prompt de UI/UX refinement

```md
Refine visualmente esta seção mantendo a identidade do 612:

- dark mode técnico;
- radius baixo;
- spacing premium;
- visual minimalista;
- tipografia Geist;
- aparência de dashboard moderno;
- sem excesso de cores;
- sem aparência de ERP antigo.

Melhore:
- hierarquia visual;
- alinhamento;
- spacing;
- responsividade;
- microinterações;
- consistência.

Evite:
- efeitos exagerados;
- animações excessivas;
- visual landing page.

Antes de alterar:
explique rapidamente a direção visual.
```

---

# Prompt de manutenção de contexto

```md
Antes de finalizar:

1. Atualize:
- TASKS.md
- CHANGELOG.md
- documentação relevante

2. Registre:
- o que foi implementado;
- decisões tomadas;
- arquivos alterados;
- pendências;
- próximos passos;
- possíveis riscos técnicos.

3. Garanta que outra IA consiga continuar o projeto sem perda de contexto.
```

---

# Estrutura recomendada de sessões

## Sessões boas

Exemplo:

```txt
Sessão 1:
- AppShell
- Sidebar
- BottomNav

Sessão 2:
- DashboardHero
- MetricCards

Sessão 3:
- ResidenceCard
- gráficos
```

---

## Sessões ruins

```txt
- autenticação
- dashboard
- cálculos
- uploads
- OCR
- analytics
- tudo junto
```

---

# Estratégia para Claude Code e OpenCode GO

## Sempre:

- manter documentação atualizada;
- manter componentes consistentes;
- evitar duplicações;
- reutilizar componentes;
- documentar decisões.

---

# Regra importante

Se algo visual ficar muito bom:

Atualizar:

```txt
UI_UX_GUIDE.md
```

Documentando:
- padrões;
- decisões;
- componentes;
- espaçamentos;
- comportamento responsivo.

---

# Ordem ideal de desenvolvimento

## Fase 1
Estrutura:
- AppShell;
- layout;
- tema;
- navegação.

---

## Fase 2
Dashboard mockado.

---

## Fase 3
Banco e entidades.

---

## Fase 4
Competências.

---

## Fase 5
Leituras e upload.

---

## Fase 6
Engine de cálculo.

---

## Fase 7
Mini faturas.

---

## Fase 8
Analytics refinado.

---

# Filosofia visual do 612

612 deve parecer:

- sistema técnico premium;
- dashboard moderno;
- observatório energético residencial.

Evitar aparência:
- ERP antigo;
- admin panel genérico;
- dashboard colorido;
- landing page exagerada.

---

# Regras críticas do projeto

- competência fechada não pode ser alterada;
- leituras exigem foto obrigatória;
- COSIP sempre divide igualmente;
- cálculos financeiros usam DECIMAL/NUMERIC;
- histórico precisa ser auditável;
- mobile-first é prioridade.

---

# Objetivo final

O projeto deve ser:
- facilmente continuável;
- organizado;
- consistente;
- confiável;
- simples de manter;
- preparado para múltiplas IAs.
