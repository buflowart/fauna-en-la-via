# Redes que ya existen: competir, complementar o aliarse

16 nov 2026. Investigación hecha con búsquedas web el mismo día. Cada dato lleva su fuente; lo que no se pudo confirmar está marcado.

## Recomendación

**Complementar y aliarse. No competir.**

Fauna en la Vía capta reportes por la web, los valida con evidencia fotográfica, los publica como datos abiertos y saca informes técnicos por corredor. No pretende ser la base nacional: entrega sus datos a quienes ya lo son (Recosfa, SiB Colombia / GBIF, iNaturalist) y cruza los suyos con los oficiales (Sukubun, BioANI, concesiones).

Por qué:

1. **Un proyecto chico que duplica una red pierde aliados y fondos.** Recosfa existe desde 2014, está ligada al ITM, tiene respaldo de una circular de MinTransporte y acaba de coorganizar el congreso latinoamericano del tema. Ya mostró interés en apoyar este proyecto.
2. **Lo que este proyecto hace distinto sí hace falta:** reporte sin instalar una app, mapa público con foto por registro, validación visible, datos descargables e informes por corredor hechos por una organización del territorio.
3. **Los fondos y la academia premian la interoperabilidad.** Publicar en Darwin Core en SiB/GBIF le da al conjunto de datos una cita y un DOI, y eso sirve ante donantes y universidades, que son dos de los tres públicos que Rubén puso primero.
4. **Las fuentes oficiales no se pueden alimentar desde afuera, pero sí contrastar.** El cruce con los registros de la concesionaria ya mostró su valor en el piloto.

## Qué es cada una

| Red | Qué es | Quién la alimenta | Relación propuesta |
|---|---|---|---|
| **Recosfa** | Red Colombiana de Seguimiento de Fauna Atropellada. Ligada al ITM (Medellín), desde 2014. App de reporte ciudadano y mapa nacional | Ciudadanos; históricamente también concesiones, con la ANI | **Aliarse.** Intercambio de datos y aval metodológico |
| **Sukubun** | Aplicativo del INVÍAS donde los administradores viales registran los atropellamientos; incluye un mapa de vulnerabilidad faunística | Administradores viales del INVÍAS (vías no concesionadas) | **Contrastar.** Pedir los datos; no se alimenta desde afuera |
| **BioANI** | Monitor de la ANI que consolida eventos con fauna en todos los modos de transporte | Concesiones, a través de la ANI | **Contrastar.** Pedir los datos de cada concesión |
| **iNaturalist** (Naturalista CO) | Plataforma global de observaciones con identificación comunitaria. Tiene la anotación "Vivo o muerto" y proyectos de atropellamiento | Cualquiera con cuenta | **Publicar ahí** lo validado, en un proyecto propio. Rubén ya lo quiere |
| **SiB Colombia / GBIF** | Red nacional de datos abiertos de biodiversidad y nodo de GBIF | Organizaciones publicadoras, en estándar Darwin Core | **Publicar ahí** el conjunto de datos, a nombre de Nordeste Salvaje |

## Lo que se encontró de cada una

### Recosfa
- Coorganizó con el ITM el 1.er Congreso Latinoamericano y Colombiano de Ecología de Carreteras (9–13 nov 2026), donde mostró su app de monitoreo participativo ([Minuto30](https://www.minuto30.com/en-colombia-mueren-cerca-de-200-millones-de-animales-al-ano-en-las-carreteras/1728709/)).
- La Circular 0006 de 2020 de MinTransporte recomendó reportar con la app de Recosfa y encargó al ITM consolidar los reportes ([circular](https://normograma.mintic.gov.co/mintic/docs/pdf/circular_mintransporte_0006_2020.pdf)).
- Más de 3.500 registros entre 2014 y 2017 ([Instituto Humboldt, 2017](https://reporte.humboldt.org.co/assets/docs/2017/2/206/biodiversidad-2017-206-ficha.pdf)).
- **Sin confirmar:** cuántos registros tiene hoy, si sus datos se pueden descargar, con qué licencia y en qué formato recibe datos de terceros. No apareció un informe consolidado de 2026 ni la ficha de la app en las tiendas. **Eso se le pregunta directamente a Recosfa** (tarea 015).
- Relación actual: iniciando; se han mostrado interesados en apoyar el proyecto (Rubén, 16 nov 2026).

### Sukubun (INVÍAS)
- Los administradores viales encargados por contrato del reporte de fauna atropellada incluyen los eventos en Sukubun ([Circular 0006 de 2020](https://normograma.mintic.gov.co/mintic/docs/pdf/circular_mintransporte_0006_2020.pdf)).
- Permite consultar los incidentes y el mapa de vulnerabilidad faunística ([Occidente](https://occidente.co/medio-ambiente/a-reducir-accidentes-con-fauna-silvestre/); [LATE](https://latinamericatransportationecology.org/news/mapa-de-vulnerabilidad-faunistica/)).
- **Sin confirmar:** si la consulta es pública y si los datos se pueden descargar.

### BioANI
- La ANI lo describe como una herramienta digital que consolida información sobre eventos con fauna en todos los modos ([columna de la ANI](https://www.ani.gov.co/sites/default/files/columna_opinion_-_infraestructura_que_conecta_territorios_y_protege_vidas.pdf)).
- **Sin confirmar:** cómo lo alimentan las concesiones, qué campos tiene y si se puede consultar. No se encontró un informe con cifras por concesión.

### iNaturalist
- Protege la ubicación de especies sensibles: pone la geoprivacidad del taxón en "Oscurecida" de forma automática, y los curadores pueden cambiarla por jurisdicción ([ayuda de iNaturalist](https://help.inaturalist.org/en/support/solutions/articles/151000233080-how-does-inaturalist-protect-the-locations-of-sensitive-species-)). **Consecuencia:** un registro que aquí se publica con coordenada exacta puede salir difuminado allá.
- La anotación "Vivo o muerto" no la tienen todas las observaciones, así que buscar por ella deja registros por fuera ([foro](https://forum.inaturalist.org/t/how-to-search-for-roadkill-records/74378)). Conviene además un proyecto propio que agrupe los registros.
- Las observaciones pertenecen a una cuenta. Subir fotos de terceros exige su permiso y una licencia compatible.
- **Sin confirmar:** condiciones y límites de la API para crear observaciones desde otra plataforma. Hay que leer la documentación oficial antes de automatizar (tarea 016).

### SiB Colombia / GBIF
- Publicar tiene cuatro pasos: ajustar los datos a Darwin Core, cargarlos en la herramienta IPT, documentar los metadatos con una licencia Creative Commons y publicar. El SiB acompaña el proceso ([guía de 2020](https://core.ac.uk/download/487179139.pdf)).
- Publican **organizaciones**; la decisión la toma su director o representante ([SiB / GBIF](https://www.gbif.es/wp-content/uploads/2019/05/COL-Autorizacion-interna-para-que-una-empresa-sea-entidad-publicadora-de-GBIF.pdf)).
- **Sin confirmar:** los requisitos formales vigentes para registrarse como publicador y si una persona natural puede publicar. Lo razonable es publicar como Nordeste Salvaje cuando la corporación exista.

## Categorías de amenaza

Todo registro lleva dos categorías, y el mapa resalta siempre las especies amenazadas:

- **Global:** Lista Roja de la UICN (LC, NT, VU, EN, CR, y DD o NE cuando no hay evaluación).
- **Nacional:** Resolución 0126 de 2024 de MinAmbiente, que establece el listado oficial de especies silvestres amenazadas de Colombia (CR, EN, VU). Reemplazó las resoluciones 1218 de 2003 y 1912 de 2017; Diario Oficial 52.674 del 19 feb 2024. Los anexos con las listas están publicados en SiB Colombia ([ANLA Eureka](https://www.anla.gov.co/wanla/eureka/normativa/resoluciones/resolucion-0126-de-2024-listado-oficial-de-las-especies-silvestres-amenazadas-de-la-diversidad-biologica-colombiana-continental-y-marino-costera)).

La tarea 004 trae la resolución y sus listas al repositorio como tabla de referencia.

## Qué pedirle y qué ofrecerle a cada una

| Con quién | Se le ofrece | Se le pide |
|---|---|---|
| Recosfa / ITM | Los registros validados del piloto y los que lleguen; crédito en la página y en los informes | Formato de intercambio; aval del método; canal para sumar validadores; presentar el proyecto como aliado |
| INVÍAS y ANI | Nada por ahora | Datos de Sukubun y BioANI de los corredores de interés, por derecho de petición |
| Concesiones | Según evolucione la relación | Sus registros de atropellamiento y la ubicación de los pasos de fauna |
| SiB Colombia | Un conjunto de datos documentado y con licencia abierta | Acompañamiento para publicar; requisitos del publicador |
| iNaturalist | Observaciones con foto y validación | Nada; cumplir sus condiciones de uso |

## Lo que no se debe hacer

- Lanzar "la app nacional de fauna atropellada" sin haber hablado antes con Recosfa.
- Presentar los datos como el total de animales muertos, aquí o en cualquier red.
- Subir a iNaturalist o al SiB fotos de terceros sin permiso.
- Tomar cifras nacionales de prensa (como "200 millones de animales al año") como datos verificados.
