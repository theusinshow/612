# DATABASE_SCHEMA.md

# Tabelas

## profiles

- id
- nome
- email
- role

---

## residencias

- id
- nome
- tipo
- status
- responsavel_nome

---

## competencias

- id
- mes
- ano
- status
- created_at
- closed_at

---

## faturas

- id
- competencia_id
- arquivo_pdf_url
- valor_total
- consumo_total_kwh
- cosip
- vencimento

---

## leituras

- id
- competencia_id
- residencia_id
- leitura_anterior
- leitura_atual
- consumo_calculado
- foto_url

---

## rateios

- id
- competencia_id
- residencia_id
- valor_consumo
- valor_cosip
- valor_total

---

## pagamentos

- id
- rateio_id
- status
- valor_pago
- data_pagamento

---

## contas_agua

- id
- residencia_id
- matricula
- mes
- ano
- valor
- vencimento
- data_pagamento
- status
- responsavel_pagamento
- arquivo_url
- observacoes
- created_at

---

## audit_logs

- id
- user_id
- acao
- entidade
- descricao
- created_at
