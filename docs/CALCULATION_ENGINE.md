# CALCULATION_ENGINE.md

# Precisão

Utilizar:
- NUMERIC
- DECIMAL

Nunca FLOAT.

---

# Fórmulas

## Consumo

consumo = leitura_atual - leitura_anterior

---

## Térrea

consumo_terrea = consumo_total - consumo_res2 - consumo_res3

---

## Energia sem COSIP

valor_energia = valor_total - COSIP

---

## Valor do kWh

valor_kwh = valor_energia / consumo_total

---

## Valor individual

valor_consumo = consumo_residencia * valor_kwh

---

## COSIP

cota_cosip = COSIP / 3

---

## Valor final

valor_final = valor_consumo + cota_cosip

---

# Validações

## Bloquear consumo negativo

Se:
leitura_atual < leitura_anterior

---

## Bloquear inconsistência

Se:
res2 + res3 > consumo_total

---

## Alertar consumo incomum

Comparar média histórica.

---

# Snapshot

Ao fechar competência:
- salvar todos os cálculos;
- salvar estado completo;
- impedir recálculo.
