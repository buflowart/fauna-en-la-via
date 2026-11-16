---
frente: portal
tamano: M
dueno: alejandro, datos de ruben
modelo: sonnet
depende: 003
---
# 009 — Cargar datos de concesiones y otras fuentes, y la capa de PR

**Objetivo.** Que los registros que lleguen de concesiones (Autopista Río Magdalena 2, Vías del Nus, Autopistas del Nordeste) y de otras redes entren a la plataforma con su fuente, y que cada registro pueda ubicarse por PR.

**Contexto mínimo.** Los datos llegan por derecho de petición, en los formatos que cada entidad use (PDF, Excel). Rubén tendrá las coordenadas de todos los PR. Requisito para aceptar un registro: coordenadas, fecha y hora.

**Pasos.**
1. Plantilla de carga (CSV) con los campos mínimos y la fuente.
2. Script de importación que valida: coordenadas dentro de Colombia, fecha y hora válidas, sin duplicar lo ya cargado (por identificador de origen).
3. Los registros sin hora o sin coordenadas no se descartan: quedan en una tabla de "incompletos" con el motivo.
4. Capa de PR: tabla con vía, PR y coordenada. Función que da el PR más cercano a un punto y la distancia.
5. En el mapa: filtro por fuente (Nordeste Salvaje, ciudadanos, concesión) y color o forma distinta. Dejar claro en la leyenda quién reportó qué.
6. Cruce entre fuentes: posibles coincidencias (misma especie, cerca, fechas próximas) se proponen; una persona decide. Una carcasa puede durar más de una semana.

**Hecho cuando.** Un archivo de prueba de 20 filas se carga dos veces y no duplica; cada registro del piloto tiene PR calculado y cinco se comprueban a mano; el filtro por fuente funciona.

**Ojo.** Lo que una entidad entrega por derecho de petición puede traer datos personales de sus empleados: se quitan antes de cargar.
