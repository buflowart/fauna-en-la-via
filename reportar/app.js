'use strict';

// ===== Configuración =====
// Pegar aquí la URL de la aplicación web de Apps Script (termina en /exec).
// Vacía = modo prueba: los reportes no se envían a ningún lado, solo se muestran en la consola.
const ENDPOINT = '';
const VERSION = '0.4';
// Número de WhatsApp que recibe las fotos originales como documento: indicativo + número, sin "+" ni espacios
// (por ejemplo 573001234567). Vacío = no se muestra el botón.
const WHATSAPP = '';
const MAX_FOTOS = 4;
const LADO_MAX = 2048;      // píxeles del lado mayor al reducir la foto
const CALIDAD = 0.85;       // calidad JPEG
const VENTANA_GPS = 120000; // ms: un punto GPS sirve si es de hasta 2 min antes de la foto

const $ = (s) => document.querySelector(s);
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
};

// Estado del reporte en curso
let r = nuevoReporte();
function nuevoReporte() {
  return {
    fotos: [], modo: null, horaToma: null,
    exif: { fecha: null, hora: null, lat: null, lon: null },
    pos: null, fuenteUbic: null, // pos: {lat, lon, prec}
    fuenteHora: null,
  };
}

// ===== Vistas =====
function ver(id) {
  document.querySelectorAll('main > section').forEach((s) => { s.hidden = s.id !== id; });
  window.scrollTo(0, 0);
}

// ===== GPS =====
let ultimaPos = null, watchId = null, gpsDenegado = false;
function iniciarGPS() {
  if (!('geolocation' in navigator) || watchId !== null) return;
  watchId = navigator.geolocation.watchPosition(
    (p) => {
      gpsDenegado = false;
      ultimaPos = { lat: p.coords.latitude, lon: p.coords.longitude, prec: p.coords.accuracy, t: p.timestamp };
      actualizarUbicacionGPS();
      pintarGPSPrincipal();
    },
    (err) => {
      if (err.code === 1) { gpsDenegado = true; navigator.geolocation.clearWatch(watchId); watchId = null; }
      pintarGPSPrincipal(); pintarUbicacion();
    },
    { enableHighAccuracy: true, maximumAge: 30000, timeout: 60000 },
  );
}
async function gpsYaPermitido() {
  try { const p = await navigator.permissions.query({ name: 'geolocation' }); return p.state === 'granted'; } catch { return false; }
}
function pintarGPSPrincipal() {
  const el = $('#gps-principal');
  if (gpsDenegado) el.textContent = '⚠️ El celular no está dando la ubicación. Actívela en los permisos del navegador.';
  else if (ultimaPos) el.textContent = `📍 GPS listo (±${Math.round(ultimaPos.prec)} m)`;
  else el.textContent = '📍 Buscando señal GPS…';
}
// En modo "GPS", toma el mejor punto obtenido cerca del momento de la foto.
function actualizarUbicacionGPS() {
  if (r.fuenteUbic !== 'GPS del teléfono al tomar la foto' && r.fuenteUbic !== 'GPS del teléfono, puesto después de la foto') return;
  if (!ultimaPos) return;
  const desde = r.fuenteUbic === 'GPS del teléfono al tomar la foto' ? r.horaToma - VENTANA_GPS : r.momentoUsarGPS - VENTANA_GPS;
  if (ultimaPos.t < desde) return;
  if (!r.pos || ultimaPos.prec <= r.pos.prec) r.pos = { lat: ultimaPos.lat, lon: ultimaPos.lon, prec: ultimaPos.prec };
  pintarUbicacion();
}

// ===== Metadatos EXIF (fecha y GPS) =====
async function leerExif(file) {
  try {
    const buf = await file.slice(0, 256 * 1024).arrayBuffer();
    const v = new DataView(buf);
    if (v.byteLength < 4 || v.getUint16(0) !== 0xFFD8) return null;
    let o = 2;
    while (o + 10 < v.byteLength) {
      if (v.getUint8(o) !== 0xFF) return null;
      const m = v.getUint8(o + 1), len = v.getUint16(o + 2);
      if (m === 0xE1 && v.getUint32(o + 4) === 0x45786966) return leerTiff(v, o + 10);
      if (m === 0xDA) return null;
      o += 2 + len;
    }
  } catch (e) { console.warn('EXIF:', e); }
  return null;
}
function leerTiff(v, t) {
  const le = v.getUint16(t) === 0x4949;
  const u16 = (o) => v.getUint16(o, le), u32 = (o) => v.getUint32(o, le);
  const TAM = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
  const ifd = (off) => {
    const res = {};
    const base = t + off;
    if (base + 2 > v.byteLength) return res;
    const n = u16(base);
    for (let i = 0; i < n; i++) {
      const e = base + 2 + i * 12;
      if (e + 12 > v.byteLength) break;
      const tipo = u16(e + 2), cnt = u32(e + 4);
      const vo = (TAM[tipo] || 1) * cnt <= 4 ? e + 8 : t + u32(e + 8);
      res[u16(e)] = { cnt, vo };
    }
    return res;
  };
  const ascii = (x) => {
    if (!x) return null;
    let s = '';
    for (let i = 0; i < x.cnt && x.vo + i < v.byteLength; i++) { const c = v.getUint8(x.vo + i); if (!c) break; s += String.fromCharCode(c); }
    return s;
  };
  const rac = (x, i) => { const d = u32(x.vo + i * 8 + 4); return d ? u32(x.vo + i * 8) / d : NaN; };
  const grados = (x) => (x && x.vo + 24 <= v.byteLength ? rac(x, 0) + rac(x, 1) / 60 + rac(x, 2) / 3600 : NaN);

  const res = { fecha: null, hora: null, lat: null, lon: null, marca: null, modelo: null, bloqueGPS: false };
  const i0 = ifd(u32(t + 4));
  res.marca = ascii(i0[0x010F]); res.modelo = ascii(i0[0x0110]);
  res.bloqueGPS = !!i0[0x8825];
  let dt = null;
  if (i0[0x8769]) { const ex = ifd(u32(i0[0x8769].vo)); dt = ascii(ex[0x9003]) || ascii(ex[0x9004]); }
  dt = dt || ascii(i0[0x0132]);
  const m = dt && dt.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2})/);
  if (m && m[1] !== '0000') { res.fecha = `${m[1]}-${m[2]}-${m[3]}`; res.hora = `${m[4]}:${m[5]}`; }
  if (i0[0x8825]) {
    const g = ifd(u32(i0[0x8825].vo));
    let lat = grados(g[2]), lon = grados(g[4]);
    if (ascii(g[1]) === 'S') lat = -lat;
    if (ascii(g[3]) === 'W') lon = -lon;
    if (isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 && !(lat === 0 && lon === 0)) {
      res.lat = lat; res.lon = lon;
    }
  }
  return res;
}

// ===== Reducir la foto =====
async function reducir(file) {
  let src;
  try { src = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch {
    src = await new Promise((ok, mal) => {
      const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = URL.createObjectURL(file);
    });
  }
  const w = src.width || src.naturalWidth, h = src.height || src.naturalHeight;
  const k = Math.min(1, LADO_MAX / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', CALIDAD);
}

// ===== Fecha y hora locales =====
const dos = (n) => String(n).padStart(2, '0');
const fechaLocal = (d) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
const horaLocal = (d) => `${dos(d.getHours())}:${dos(d.getMinutes())}`;

// ===== Elegir fotos =====
async function alElegir(input, modo) {
  const files = [...input.files];
  input.value = '';
  if (!files.length) return;
  const primera = r.fotos.length === 0;
  if (primera) { r = nuevoReporte(); r.modo = modo; r.horaToma = Date.now(); }
  $('#procesando').hidden = false;
  try {
    for (const f of files.slice(0, MAX_FOTOS - r.fotos.length)) {
      const ex = await leerExif(f);
      if (ex) {
        if (!r.exif.fecha && ex.fecha) { r.exif.fecha = ex.fecha; r.exif.hora = ex.hora; }
        if (r.exif.lat === null && ex.lat !== null) { r.exif.lat = ex.lat; r.exif.lon = ex.lon; }
      }
      r.fotos.push(await reducir(f));
    }
  } catch (e) {
    console.error(e);
    alert('No se pudo leer la foto. Intente de nuevo.');
  } finally { $('#procesando').hidden = true; }
  if (!r.fotos.length) return;
  if (primera) decidirDatos(); else completarConExif();
  pintarRevision();
  ver('revision');
}

function decidirDatos() {
  // Hora: metadatos > hora del teléfono al tomar la foto > a mano
  if (r.exif.fecha) {
    $('#fecha').value = r.exif.fecha; $('#hora').value = r.exif.hora; r.fuenteHora = 'Metadatos de la foto';
  } else if (r.modo === 'camara') {
    const d = new Date(r.horaToma);
    $('#fecha').value = fechaLocal(d); $('#hora').value = horaLocal(d); r.fuenteHora = 'Hora del teléfono al tomar la foto';
  } else {
    $('#fecha').value = ''; $('#hora').value = ''; r.fuenteHora = null;
  }
  // Ubicación: metadatos > GPS del teléfono (solo si la foto se tomó ahora) > nada
  if (r.exif.lat !== null) {
    r.pos = { lat: r.exif.lat, lon: r.exif.lon, prec: null }; r.fuenteUbic = 'Metadatos de la foto';
  } else if (r.modo === 'camara') {
    r.fuenteUbic = 'GPS del teléfono al tomar la foto'; iniciarGPS(); actualizarUbicacionGPS();
  } else {
    r.fuenteUbic = null;
  }
}
// Al agregar otra foto: si la primera no traía datos y esta sí, usarlos.
function completarConExif() {
  if (!r.fuenteHora && r.exif.fecha) { $('#fecha').value = r.exif.fecha; $('#hora').value = r.exif.hora; r.fuenteHora = 'Metadatos de la foto'; }
  if (!r.pos && r.exif.lat !== null) { r.pos = { lat: r.exif.lat, lon: r.exif.lon, prec: null }; r.fuenteUbic = 'Metadatos de la foto'; }
}

// ===== Pintar la revisión =====
function pintarRevision() {
  const cont = $('#miniaturas');
  cont.innerHTML = '';
  r.fotos.forEach((src, i) => {
    const fig = document.createElement('figure');
    const img = document.createElement('img'); img.src = src; img.alt = `Foto ${i + 1}`;
    const quitar = document.createElement('button'); quitar.type = 'button'; quitar.textContent = '✕'; quitar.setAttribute('aria-label', `Quitar foto ${i + 1}`);
    quitar.onclick = () => {
      r.fotos.splice(i, 1);
      if (!r.fotos.length) { limpiar(); ver('principal'); } else pintarRevision();
    };
    fig.append(img, quitar); cont.append(fig);
  });
  $('#btn-otra').hidden = r.fotos.length >= MAX_FOTOS;
  pintarUbicacion();
  $('#fuente-hora').textContent = r.fuenteHora || '';
}

function pintarUbicacion() {
  const txt = $('#txt-ubicacion'), fuente = $('#fuente-ubicacion'), btn = $('#btn-usar-gps');
  if (!txt) return;
  btn.hidden = true;
  if (r.pos) {
    const c = `${r.pos.lat.toFixed(6)}, ${r.pos.lon.toFixed(6)}`;
    const prec = r.pos.prec ? ` (±${Math.round(r.pos.prec)} m)` : '';
    txt.innerHTML = '';
    const a = document.createElement('a');
    a.href = `https://www.google.com/maps?q=${r.pos.lat},${r.pos.lon}`; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = c;
    txt.append(a, document.createTextNode(prec));
    if (r.pos.prec && r.pos.prec > 50) txt.append(document.createTextNode(' · afinando…'));
    fuente.textContent = r.fuenteUbic || '';
  } else if (r.fuenteUbic && r.fuenteUbic.startsWith('GPS')) {
    txt.textContent = gpsDenegado ? 'El celular no dio la ubicación. Escriba una referencia del sitio abajo.' : 'Buscando señal GPS…';
    fuente.textContent = '';
  } else {
    txt.textContent = WHATSAPP
      ? 'El celular no dejó pasar la ubicación de la foto. Al enviar el reporte podrá mandar la foto original por WhatsApp, y de ahí la sacamos.'
      : 'La foto no trae ubicación.';
    fuente.textContent = '';
    btn.hidden = false;
  }
  $('#btn-mapa').textContent = r.pos ? '🗺️ Corregir el punto en el mapa' : '🗺️ Marcar el punto en el mapa';
}

// ===== Mapa para marcar el punto a mano (necesita señal) =====
const CENTRO_CORREDOR = [6.65, -74.79];
let mapa = null, marcador = null, puntoMapa = null;
function cargarLeaflet() {
  if (window.L) return Promise.resolve();
  return new Promise((ok, mal) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.append(css);
    const js = document.createElement('script');
    js.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    js.onload = ok; js.onerror = mal;
    document.head.append(js);
  });
}
async function abrirMapa() {
  const btn = $('#btn-mapa');
  btn.disabled = true; btn.textContent = 'Abriendo el mapa…';
  try { await cargarLeaflet(); } catch {
    btn.disabled = false; pintarUbicacion();
    alert('Sin señal no se puede abrir el mapa. Escriba una referencia del sitio.');
    return;
  }
  btn.disabled = false; btn.hidden = true;
  $('#mapa-caja').hidden = false;
  const inicio = r.pos ? [r.pos.lat, r.pos.lon] : (ultimaPos ? [ultimaPos.lat, ultimaPos.lon] : CENTRO_CORREDOR);
  if (!mapa) {
    mapa = L.map('mapa');
    const sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Imágenes © Esri' });
    const calles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' });
    calles.addTo(mapa); // el mapa de calles muestra la autopista y los pueblos; el satélite sirve de cerca
    L.control.layers({ 'Mapa': calles, 'Satélite': sat }).addTo(mapa);
    mapa.on('click', (e) => {
      puntoMapa = e.latlng;
      if (marcador) marcador.setLatLng(e.latlng); else marcador = L.marker(e.latlng).addTo(mapa);
      $('#btn-mapa-ok').disabled = false;
    });
  }
  mapa.setView(inicio, r.pos || ultimaPos ? 16 : 12);
  setTimeout(() => mapa.invalidateSize(), 50);
  if (r.pos) { puntoMapa = L.latLng(r.pos.lat, r.pos.lon); if (marcador) marcador.setLatLng(puntoMapa); else marcador = L.marker(puntoMapa).addTo(mapa); $('#btn-mapa-ok').disabled = false; }
  else { puntoMapa = null; if (marcador) { marcador.remove(); marcador = null; } $('#btn-mapa-ok').disabled = true; }
}
function cerrarMapa() { $('#mapa-caja').hidden = true; $('#btn-mapa').hidden = false; pintarUbicacion(); }
function usarPuntoMapa() {
  if (!puntoMapa) return;
  r.pos = { lat: puntoMapa.lat, lon: puntoMapa.lng, prec: null };
  r.fuenteUbic = 'Marcado a mano en el mapa';
  cerrarMapa();
}

// ===== Cola de envío (IndexedDB) =====
function abrirDB() {
  return new Promise((ok, mal) => {
    const q = indexedDB.open('reportes', 1);
    q.onupgradeneeded = () => q.result.createObjectStore('cola', { keyPath: 'id' });
    q.onsuccess = () => ok(q.result); q.onerror = () => mal(q.error);
  });
}
async function tx(modo, fn) {
  const d = await abrirDB();
  return new Promise((ok, mal) => {
    const t = d.transaction('cola', modo);
    const req = fn(t.objectStore('cola'));
    t.oncomplete = () => ok(req ? req.result : undefined);
    t.onerror = () => mal(t.error);
  });
}
const memoria = new Map(); // respaldo si IndexedDB no funciona (navegación privada)
const cola = {
  async poner(x) { try { await tx('readwrite', (s) => s.put(x)); } catch { memoria.set(x.id, x); } },
  async quitar(id) { memoria.delete(id); try { await tx('readwrite', (s) => s.delete(id)); } catch { /* nada */ } },
  async todos() { let a = []; try { a = await tx('readonly', (s) => s.getAll()); } catch { /* nada */ } return [...a, ...memoria.values()]; },
};

let enviando = false;
async function procesarCola() {
  if (enviando) return;
  enviando = true;
  try {
    const items = (await cola.todos()).sort((a, b) => a.creado.localeCompare(b.creado));
    for (const x of items) {
      if (!(await subir(x))) break;
      await cola.quitar(x.id);
    }
  } finally { enviando = false; await pintarPendientes(); }
}
async function subir(x) {
  const { destino, ...datos } = x;
  if (!ENDPOINT) {
    await new Promise((s) => setTimeout(s, 600));
    console.log('[modo prueba] reporte:', { ...datos, fotos: datos.fotos.map((f) => `${Math.round(f.length * 0.75 / 1024)} KB`) });
    window.ultimoReportePrueba = datos;
    return true;
  }
  if (!navigator.onLine) return false;
  try {
    const resp = await fetch(ENDPOINT, { method: 'POST', body: JSON.stringify(datos) });
    const j = await resp.json();
    return !!j.ok;
  } catch (e) { console.warn('Envío:', e); return false; }
}
async function pintarPendientes() {
  const n = (await cola.todos()).length;
  $('#pendientes').hidden = n === 0;
  $('#txt-pendientes').textContent = n === 1 ? '📤 1 reporte esperando señal.' : `📤 ${n} reportes esperando señal.`;
  return n;
}

// ===== Enviar =====
function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
function mostrarError(msg) { const e = $('#error'); e.textContent = msg; e.hidden = !msg; }

async function enviar() {
  const estadoAnimal = document.querySelector('input[name="estado"]:checked');
  const referencia = $('#referencia').value.trim();
  if (!estadoAnimal) return mostrarError('Diga si el animal estaba muerto, herido o vivo.');
  if (!$('#fecha').value) return mostrarError('Falta la fecha de la foto.');
  if (!r.pos && !referencia && !confirm('El reporte no tiene ubicación ni referencia del sitio. Sin eso es difícil ubicarlo en la vía.\n\n¿Enviarlo así de todos modos?')) {
    return mostrarError('Marque el punto en el mapa o escriba una referencia del sitio.');
  }
  mostrarError('');
  const horaEditada = r.fuenteHora && ($('#fecha').dataset.editado === '1' || $('#hora').dataset.editado === '1');
  const x = {
    id: uuid(),
    creado: new Date().toISOString(),
    fecha: $('#fecha').value,
    hora: $('#hora').value,
    fuente_hora: horaEditada ? `Escrita a mano (antes: ${r.fuenteHora})` : (r.fuenteHora || 'Escrita a mano'),
    lat: r.pos ? Number(r.pos.lat.toFixed(6)) : null,
    lon: r.pos ? Number(r.pos.lon.toFixed(6)) : null,
    precision: r.pos && r.pos.prec ? Math.round(r.pos.prec) : null,
    fuente_ubicacion: r.pos ? r.fuenteUbic : 'Sin ubicación',
    estado: estadoAnimal.value,
    animal: $('#animal').value.trim(),
    referencia,
    nota: $('#nota').value.trim(),
    nombre: ls.get('nombre') || '',
    telefono: ls.get('telefono') || '',
    web: $('#web').value,
    fotos: r.fotos.map((d) => d.split(',')[1]),
    version: VERSION,
    destino: ENDPOINT,
  };
  $('#btn-enviar').disabled = true;
  await cola.poner(x);
  // Pedir envío en segundo plano (Android). getRegistration no se queda esperando si no hay service worker.
  try { const reg = await navigator.serviceWorker?.getRegistration(); if (reg?.active) await reg.sync?.register('enviar-reportes'); } catch { /* sin sincronización en segundo plano */ }
  // Foto de la galería sin ubicación en los metadatos: ofrecer mandar el original por WhatsApp.
  const pedirOriginal = WHATSAPP && r.modo === 'galeria' && r.exif.lat === null;
  const codigo = x.id.slice(0, 8).toUpperCase();
  limpiar();
  $('#caja-whatsapp').hidden = !pedirOriginal;
  if (pedirOriginal) {
    $('#codigo-reporte').textContent = codigo;
    const texto = `Hola. Envío como documento la foto original del reporte de fauna en la vía, código ${codigo} (${x.fecha}${x.hora ? ' ' + x.hora : ''}, ${x.estado.toLowerCase()}).`;
    $('#btn-whatsapp').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  }
  $('#titulo-listo').textContent = 'Reporte guardado';
  $('#txt-listo').textContent = 'Enviando…';
  ver('listo');
  await procesarCola();
  const quedan = (await cola.todos()).some((y) => y.id === x.id);
  $('#titulo-listo').textContent = quedan ? 'Reporte guardado en el celular' : 'Reporte enviado';
  $('#txt-listo').textContent = quedan
    ? 'No hay señal en este momento. Se envía solo cuando vuelva a abrir esta página con señal.'
    : (ENDPOINT ? '¡Gracias! Ya llegó a Nordeste Salvaje.' : 'Modo prueba: el reporte no salió del celular.');
  $('#btn-enviar').disabled = false;
}

function limpiar() {
  r = nuevoReporte();
  ['animal', 'referencia', 'nota', 'web', 'fecha', 'hora'].forEach((id) => { $('#' + id).value = ''; delete $('#' + id).dataset.editado; });
  document.querySelectorAll('input[name="estado"]').forEach((i) => { i.checked = false; });
  mostrarError('');
  $('#mapa-caja').hidden = true; $('#btn-mapa').hidden = false;
}

// ===== Bienvenida =====
function mostrarBienvenida() {
  $('#nombre').value = ls.get('nombre') || '';
  $('#telefono').value = ls.get('telefono') || '';
  ver('bienvenida');
}
function pedirPermisoGPS() {
  const el = $('#estado-permiso');
  if (!('geolocation' in navigator)) { el.textContent = 'Este navegador no da ubicación.'; return; }
  el.textContent = 'Esperando respuesta del celular…';
  navigator.geolocation.getCurrentPosition(
    () => { el.textContent = '✓ Ubicación permitida.'; iniciarGPS(); },
    (e) => { el.textContent = e.code === 1 ? 'No se dio el permiso. Puede activarlo después en los ajustes del navegador.' : 'Permiso dado, pero todavía no hay señal GPS.'; if (e.code !== 1) iniciarGPS(); },
    { enableHighAccuracy: true, timeout: 20000 },
  );
}
function guardarDatos() {
  const nombre = $('#nombre').value.trim();
  const err = $('#error-bienvenida');
  if (!nombre) { err.textContent = 'Escriba su nombre.'; err.hidden = false; return; }
  err.hidden = true;
  ls.set('nombre', nombre);
  ls.set('telefono', $('#telefono').value.trim());
  irAPrincipal();
}
async function irAPrincipal() {
  $('#quien').textContent = ls.get('nombre') || '';
  ver('principal');
  pintarGPSPrincipal();
  await pintarPendientes();
}

// ===== Arranque =====
$('#btn-permiso').onclick = pedirPermisoGPS;
$('#btn-guardar-datos').onclick = guardarDatos;
$('#btn-cambiar').onclick = mostrarBienvenida;
$('#btn-camara').onclick = () => { iniciarGPS(); $('#in-camara').click(); };
$('#btn-galeria').onclick = () => $('#in-galeria').click();
$('#btn-otra').onclick = () => (r.modo === 'camara' ? $('#in-camara') : $('#in-galeria')).click();
$('#in-camara').onchange = (e) => alElegir(e.target, 'camara');
$('#in-galeria').onchange = (e) => alElegir(e.target, 'galeria');
$('#btn-usar-gps').onclick = () => {
  r.fuenteUbic = 'GPS del teléfono, puesto después de la foto'; r.momentoUsarGPS = Date.now(); r.pos = null;
  iniciarGPS(); actualizarUbicacionGPS(); pintarUbicacion();
};
['fecha', 'hora'].forEach((id) => $('#' + id).addEventListener('input', (e) => {
  e.target.dataset.editado = '1';
  if (!r.fuenteHora) $('#fuente-hora').textContent = 'Escrita a mano';
}));
// ===== Prueba de metadatos (solo con ?prueba en la dirección) =====
async function probarFoto(input, via) {
  const f = input.files[0];
  input.value = '';
  if (!f) return;
  const ex = await leerExif(f);
  const filas = [
    ['Cómo se escogió', via],
    ['Archivo', `${f.name} · ${f.type || 'sin tipo'} · ${Math.round(f.size / 1024)} KB`],
    ['¿Trae metadatos EXIF?', ex ? 'Sí' : 'No'],
    ['Cámara', ex && (ex.marca || ex.modelo) ? `${ex.marca || ''} ${ex.modelo || ''}`.trim() : '—'],
    ['Fecha y hora', ex && ex.fecha ? `${ex.fecha} ${ex.hora}` : 'No trae'],
    ['Ubicación', ex && ex.lat !== null ? `${ex.lat.toFixed(6)}, ${ex.lon.toFixed(6)}` : (ex && ex.bloqueGPS ? 'Trae el bloque GPS, pero vacío (el celular la borró)' : 'No trae')],
  ];
  const caja = document.createElement('div');
  caja.className = 'dato';
  filas.forEach(([k, v]) => {
    const p = document.createElement('p');
    const b = document.createElement('b'); b.textContent = k + ': ';
    p.append(b, document.createTextNode(v));
    caja.append(p);
  });
  $('#resultado-prueba').prepend(caja);
}
const modoPrueba = new URLSearchParams(location.search).has('prueba');
$('#btn-ir-prueba').hidden = !modoPrueba;
$('#btn-ir-prueba').onclick = () => ver('prueba');
$('#btn-salir-prueba').onclick = irAPrincipal;
$('#btn-prueba-galeria').onclick = () => $('#in-prueba-galeria').click();
$('#btn-prueba-archivos').onclick = () => $('#in-prueba-archivos').click();
$('#in-prueba-galeria').onchange = (e) => probarFoto(e.target, 'Galería (selector de fotos)');
$('#in-prueba-archivos').onchange = (e) => probarFoto(e.target, 'Archivos (explorador)');

$('#btn-mapa').onclick = abrirMapa;
$('#btn-mapa-ok').onclick = usarPuntoMapa;
$('#btn-mapa-cancelar').onclick = cerrarMapa;
$('#btn-enviar').onclick = enviar;
$('#btn-cancelar').onclick = () => { limpiar(); irAPrincipal(); };
$('#btn-nuevo').onclick = irAPrincipal;
$('#btn-reintentar').onclick = procesarCola;
window.addEventListener('online', procesarCola);
setInterval(() => { if (navigator.onLine) procesarCola(); }, 60000);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW:', e));

(async () => {
  if (await gpsYaPermitido()) iniciarGPS();
  if (ls.get('nombre')) irAPrincipal(); else mostrarBienvenida();
  procesarCola();
})();
