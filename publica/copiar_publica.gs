/**
 * Tarea 001 — copia pública filtrada de la hoja maestra.
 *
 * Se pega en la hoja NUEVA "Fauna en la Vía — datos públicos" (Extensiones > Apps Script),
 * NO en la maestra. Copia solo las columnas de la lista blanca y solo los registros
 * con Validado = "Sí". No deja ningún enlace vivo a la maestra: copia valores.
 *
 * Instalación (una vez, la hace quien tenga acceso a la maestra, o sea Rubén):
 *   1. Poner el ID de la maestra en MAESTRA_ID.
 *   2. Ejecutar copiarPublica() y aceptar permisos (solo lee la maestra).
 *   3. Ejecutar instalarDisparador() para que se actualice cada hora.
 *   4. En la hoja pública: Compartir > "Cualquier persona con el enlace" > Lector.
 *   5. Pasarle a Alejandro el ID de la hoja pública (va en index.html, variable SHEET).
 *   6. Rubén quita el acceso por enlace a la maestra.
 */

var MAESTRA_ID = 'PONER_ID_DE_LA_MAESTRA';
var HOJA_MAESTRA = 'Registros'; // nombre de la pestaña con los registros; ajustar al real

// Lista blanca decidida por Rubén el 2026-11-16 (decisiones 19 y 21).
// 'Observación pública' es una columna nueva en la maestra, llenada a mano. NO es 'Notas'.
var COLUMNAS_PUBLICAS = [
  'ID', 'Especie', 'Nombre común', 'Grupo', 'Fecha', 'Hora', 'Latitud', 'Longitud',
  'Foto (URL)', 'Observación pública',
  'Unidad funcional', 'Concesión', 'Tramo de la concesión'
];

// La generación del proyecto es dato de la concesión, no del registro.
// Completar desde el contrato o la ficha de la ANI, NO de memoria. Sin dato → "por confirmar".
var GENERACION_POR_CONCESION = {
  // 'Autopista Río Magdalena 2': { generacion: '4G', fuente: 'URL de la ficha ANI' },
  // 'Vías del Nus':              { generacion: '...', fuente: '...' },
  // 'Autopistas del Nordeste':   { generacion: '...', fuente: '...' }
};

function copiarPublica() {
  var maestra = SpreadsheetApp.openById(MAESTRA_ID);
  var origen = maestra.getSheetByName(HOJA_MAESTRA) || maestra.getSheets()[0];
  var datos = origen.getDataRange().getValues();
  var enc = datos[0].map(function (h) { return String(h).trim(); });

  var idx = {};
  COLUMNAS_PUBLICAS.concat(['Validado']).forEach(function (c) {
    // 'Observación pública' puede no existir todavía: se copia vacía.
    idx[c] = enc.indexOf(c);
  });
  if (idx['Validado'] < 0) throw new Error('La maestra no tiene la columna Validado.');
  var faltan = COLUMNAS_PUBLICAS.filter(function (c) { return idx[c] < 0 && c !== 'Observación pública'; });
  if (faltan.length) throw new Error('Faltan columnas en la maestra: ' + faltan.join(', '));

  var salida = [COLUMNAS_PUBLICAS.concat(['Generación del proyecto'])];
  for (var r = 1; r < datos.length; r++) {
    var fila = datos[r];
    if (String(fila[idx['Validado']]).trim() !== 'Sí') continue;
    var out = COLUMNAS_PUBLICAS.map(function (c) { return idx[c] < 0 ? '' : fila[idx[c]]; });
    var conc = String(fila[idx['Concesión']] || '').trim();
    var g = GENERACION_POR_CONCESION[conc];
    out.push(g ? g.generacion : (conc ? 'por confirmar' : 'no concesionada'));
    salida.push(out);
  }

  var destino = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  destino.clearContents();
  destino.getRange(1, 1, salida.length, salida[0].length).setValues(salida);
}

function instalarDisparador() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('copiarPublica').timeBased().everyHours(1).create();
}
