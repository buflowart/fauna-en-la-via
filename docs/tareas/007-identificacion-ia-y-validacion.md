---
frente: portal
tamano: L
dueno: alejandro, criterio de ruben
modelo: sonnet para construir, opus para el criterio de identificación
depende: 003, 004, 006
---
# 007 — Identificación con IA y cola de validación

**Objetivo.** Que cada reporte reciba una propuesta de especie con nivel de confianza, que lo dudoso quede señalado y que una persona valide con pocos toques.

**Contexto mínimo.** Decisión 10 de `docs/DECISIONES.md`. Así se trabaja hoy en el piloto: un modelo propone a partir de la foto y Rubén confirma. La pestaña Validar de `index.html` no guarda.

**Pasos.**
1. Inicio de sesión para validadores. Sin sesión no se valida.
2. Al recibir un reporte: pedir a un modelo con visión la especie más probable, hasta dos alternativas, los caracteres en que se basa y un nivel de confianza (alto, medio, bajo). Usar el contexto: ubicación, fecha y lista de especies ya registradas en la zona.
3. Regla de cola: confianza baja, foto en mal estado o **especie amenazada** van marcadas como "dudoso" o "prioritario". Nada se valida solo.
4. Pantalla del validador: foto grande, propuesta de la IA con sus razones, mapa, y botones Validar, Corregir especie, Dudoso, Rechazar (con motivo), Duplicado de.
5. Aviso de posible duplicado: misma especie a pocos metros en los últimos quince días.
6. Guardar quién validó y cuándo, sin borrar la propuesta original.
7. Medir: de lo que la IA propuso con confianza alta, cuánto confirmó el validador.

**Hecho cuando.**
- Diez fotos de la base, con especie ya validada, pasan por el flujo: se reporta el acierto por nivel de confianza.
- Un reporte de especie amenazada queda marcado como prioritario aunque la confianza sea alta.
- Un reporte no aparece en el mapa hasta que una persona lo valida.
- El historial conserva la propuesta de la IA después de una corrección.

**Ojo.** El costo de la identificación por reporte se estima antes de lanzar y se anota en `docs/ESCALA.md`. Las claves del modelo, en secretos.
