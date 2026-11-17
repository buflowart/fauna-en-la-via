/**
 * Recepción de reportes de "Fauna en la vía" (Nordeste Salvaje).
 *
 * Recibe los reportes que manda la página, guarda las fotos en una carpeta PRIVADA de Drive
 * y agrega una fila en la hoja "Reportes entrantes". Nada entra directo a la base maestra:
 * Rubén revisa cada reporte y lo pasa a Registros o a Fauna viva.
 *
 * Instalación (una sola vez):
 *  1. script.google.com → Nuevo proyecto → pegar este archivo.
 *  2. Ejecutar la función `configurar` y dar los permisos. Crea en Mi unidad la carpeta
 *     "Reportes entrantes - Fauna en la vía" y adentro la hoja del mismo nombre.
 *  3. Implementar → Nueva implementación → Aplicación web.
 *     Ejecutar como: Yo. Quién tiene acceso: Cualquier persona.
 *  4. Copiar la URL que termina en /exec y pegarla en ENDPOINT, en web/app.js.
 * Si se cambia este código: Implementar → Gestionar implementaciones → editar → Versión nueva
 * (así la URL no cambia).
 */

const AVISAR_POR_CORREO = true;   // correo a la cuenta dueña del script por cada reporte nuevo
const MAX_POR_MINUTO = 20;        // freno contra envíos masivos
const MAX_FOTOS = 4;
const MAX_FOTO_BASE64 = 10 * 1024 * 1024;

const ENCABEZADOS = [
  'Recibido', 'ID del reporte', 'Fecha', 'Hora', 'Fuente de la hora',
  'Latitud', 'Longitud', 'Precisión GPS (m)', 'Fuente de la ubicación',
  'Estado del animal', 'Animal (según quien reporta)', 'Referencia del sitio', 'Nota',
  'Nombre', 'Teléfono', 'Fotos', 'Revisión', 'ID en la base', 'Versión de la página',
];

const PROPS = PropertiesService.getScriptProperties();

function configurar() {
  let carpetaId = PROPS.getProperty('CARPETA_ID');
  if (!carpetaId) {
    carpetaId = DriveApp.createFolder('Reportes entrantes - Fauna en la vía').getId();
    PROPS.setProperty('CARPETA_ID', carpetaId);
  }
  let hojaId = PROPS.getProperty('HOJA_ID');
  if (!hojaId) {
    const ss = SpreadsheetApp.create('Reportes entrantes - Fauna en la vía');
    ss.setSpreadsheetLocale('en_US');            // punto decimal, como la base maestra
    ss.setSpreadsheetTimeZone('America/Bogota');
    DriveApp.getFileById(ss.getId()).moveTo(DriveApp.getFolderById(carpetaId));
    const sh = ss.getSheets()[0];
    sh.setName('Reportes');
    sh.appendRow(ENCABEZADOS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight('bold');
    sh.getRange('F:G').setNumberFormat('0.000000');
    sh.getRange('C:D').setNumberFormat('@');
    hojaId = ss.getId();
    PROPS.setProperty('HOJA_ID', hojaId);
  }
  Logger.log('Carpeta: https://drive.google.com/drive/folders/' + carpetaId);
  Logger.log('Hoja: https://docs.google.com/spreadsheets/d/' + hojaId);
}

function doGet() {
  return json({ ok: true, servicio: 'Fauna en la vía', hora: new Date().toISOString() });
}

function doPost(e) {
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'formato' });
  }
  // Trampa para robots: el campo "web" está escondido en la página; una persona lo deja vacío.
  if (d.web) return json({ ok: true });
  if (!d.id || !/^[0-9a-f-]{36}$/i.test(d.id)) return json({ ok: false, error: 'id' });
  if (!dentroDelLimite()) return json({ ok: false, error: 'limite' });

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sh = SpreadsheetApp.openById(PROPS.getProperty('HOJA_ID')).getSheetByName('Reportes');
    const n = sh.getLastRow() - 1;
    if (n > 0) {
      const ids = sh.getRange(2, 2, n, 1).getValues().map((f) => f[0]);
      if (ids.indexOf(d.id) !== -1) return json({ ok: true, repetido: true }); // reintento de un reporte ya recibido
    }

    const carpeta = DriveApp.getFolderById(PROPS.getProperty('CARPETA_ID'));
    const fotos = (Array.isArray(d.fotos) ? d.fotos : []).slice(0, MAX_FOTOS);
    const urls = [];
    fotos.forEach((b64, i) => {
      if (typeof b64 !== 'string' || b64.length > MAX_FOTO_BASE64) return;
      const nombre = (limpio(d.fecha) || 'sin-fecha') + '_' + d.id.slice(0, 8) + String.fromCharCode(97 + i) + '.jpg';
      const blob = Utilities.newBlob(Utilities.base64Decode(b64), 'image/jpeg', nombre);
      urls.push(carpeta.createFile(blob).getUrl());
    });

    sh.appendRow([
      new Date(), d.id, texto(d.fecha), texto(d.hora), texto(d.fuente_hora),
      numero(d.lat), numero(d.lon), numero(d.precision), texto(d.fuente_ubicacion),
      texto(d.estado), texto(d.animal), texto(d.referencia), texto(d.nota),
      texto(d.nombre), texto(d.telefono), urls.join('\n'), 'Pendiente', '', texto(d.version),
    ]);

    if (AVISAR_POR_CORREO) avisar(d, urls);
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function dentroDelLimite() {
  const cache = CacheService.getScriptCache();
  const clave = 'n_' + Math.floor(Date.now() / 60000);
  const n = Number(cache.get(clave) || 0) + 1;
  cache.put(clave, String(n), 120);
  return n <= MAX_POR_MINUTO;
}

function avisar(d, urls) {
  const punto = d.lat != null ? d.lat + ', ' + d.lon : 'sin ubicación';
  const cuerpo = [
    'Estado: ' + limpio(d.estado),
    'Animal: ' + (limpio(d.animal) || '(no dicho)'),
    'Fecha y hora: ' + limpio(d.fecha) + ' ' + limpio(d.hora) + ' (' + limpio(d.fuente_hora) + ')',
    'Punto: ' + punto + ' (' + limpio(d.fuente_ubicacion) + ')',
    'Referencia: ' + limpio(d.referencia),
    'Nota: ' + limpio(d.nota),
    'Reporta: ' + limpio(d.nombre) + ' ' + limpio(d.telefono),
    '',
    'Fotos:',
    urls.join('\n'),
    '',
    'Hoja: https://docs.google.com/spreadsheets/d/' + PROPS.getProperty('HOJA_ID'),
  ].join('\n');
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
    'Nuevo reporte de fauna en la vía: ' + limpio(d.estado) + ' ' + limpio(d.animal), cuerpo);
}

// Texto seguro para la hoja: corto y sin fórmulas (=, +, -, @ al inicio).
function limpio(v) { return v == null ? '' : String(v).slice(0, 1000); }
function texto(v) { const s = limpio(v); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function numero(v) { const n = Number(v); return v === null || v === '' || !isFinite(n) ? '' : n; }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
