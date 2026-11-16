---
frente: portal
tamano: M
dueno: alejandro
modelo: sonnet
depende: 003, 005; para publicar, la corporación constituida
---
# 016 — Exportar en Darwin Core y publicar en SiB Colombia e iNaturalist

**Objetivo.** Que los datos validados salgan de la plataforma en el estándar que usan las redes, y publicarlos.

**Contexto mínimo.** Decisión 13 de `docs/DECISIONES.md`. Lo encontrado sobre cada red, con lo que falta confirmar, está en `docs/REDES.md`.

**Pasos.**
1. Tabla de correspondencia entre el modelo de datos y Darwin Core (`occurrenceID`, `eventDate`, `eventTime`, `decimalLatitude`, `decimalLongitude`, `coordinateUncertaintyInMeters`, `scientificName`, `basisOfRecord`, `occurrenceStatus`, `vitality`, `recordedBy`, `identifiedBy`, `license`, `associatedMedia`, entre otros). Verificar cada término en la referencia oficial de Darwin Core.
2. Script de exportación desde la vista pública. `recordedBy` solo con permiso de crédito.
3. Validar el archivo con el validador de GBIF.
4. Escribir al SiB Colombia para confirmar los requisitos del publicador y pedir acompañamiento.
5. iNaturalist: leer la documentación oficial de la API y sus condiciones antes de automatizar. Crear el proyecto. Subir solo fotos con permiso y licencia compatible. Marcar "muerto" en la anotación correspondiente.
6. Tener en cuenta que iNaturalist puede difuminar la ubicación de especies sensibles.

**Hecho cuando.** El archivo pasa el validador de GBIF sin errores; el conjunto de datos aparece publicado con su cita; el proyecto de iNaturalist existe y tiene los registros con permiso.
