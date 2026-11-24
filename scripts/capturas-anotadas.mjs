// Capturas anotadas de Última Milla para el portfolio: un recorte con zoom de una sola zona de la
// pantalla real (Expo Web, tamaño de teléfono), con etiquetas grandes numeradas en una columna a la
// derecha (celestes = algo que funciona, ámbar = algo para mejorar) y una flecha curva hacia cada
// punto. También arma las tarjetas de código y el diagrama de arquitectura.
// Uso (con `npm run web` levantado): `node scripts/capturas-anotadas.mjs <salida> [nombre]`
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:8081';
const OUT = process.argv[2] ?? 'docs/capturas-anotadas';
const SOLO = process.argv[3];
mkdirSync(OUT, { recursive: true });

const TELEFONO = { width: 390, height: 1800 };

// zona: elementos que tiene que abarcar el recorte (+ margen); `ancho` lo limita desde la izquierda.
// notas: s = selector | t = texto; n = índice (-1 = último); fx/fy = punto dentro del elemento (0 a 1);
// en = dónde apunta la flecha ('arriba', 'abajo', 'centro'; derecha por defecto); alerta = para mejorar.
// rol: con qué usuario entra ('chofer', 'cliente' o ninguno); oscuro: modo oscuro del sistema.
const CAPTURAS = [
  {
    nombre: 'um-p01-roles', ruta: '/login', rol: null,
    zona: [{ t: '¿Cómo querés entrar?' }, { t: 'Seguí tu pedido en el mapa', exacto: false }], margen: 18, extraAbajo: 14,
    notas: [
      { t: 'Soy chofer', exacto: true, label: 'Dos personas miran la misma ruta: quien reparte…' },
      { t: 'Soy cliente', exacto: true, label: '…y el comercio que espera su pedido' },
      { t: 'Demo con datos simulados', exacto: false, en: 'centro', fx: 0.98, fy: 0.5, label: 'Se prueba con un toque, sin registrarse' },
    ],
  },
  {
    nombre: 'um-p02-cuanto-falta', ruta: '/cliente', rol: 'cliente',
    zona: [{ t: 'Mi pedido', exacto: true }, { t: 'Entregado', exacto: true }], margen: 18, extraAbajo: 8,
    notas: [
      { t: 'Llega en', exacto: false, label: 'La pregunta de todos los días, respondida arriba de todo' },
      { t: 'antes hay', exacto: false, label: 'Cuántas entregas hay antes: el porqué de la espera' },
      { t: 'Entregado', exacto: true, label: 'Las etapas, como en un envío de una tienda online' },
    ],
  },
  {
    nombre: 'um-p03-resumen', ruta: '/chofer/resumen', rol: 'chofer',
    zona: [{ t: 'JORNADA DE HOY' }, { t: 'En la calle', exacto: true }], margen: 18, extraAbajo: 110,
    notas: [
      { t: 'Dentro de la franja', exacto: true, label: 'Puntualidad medida contra la franja que pidió cada cliente' },
      { t: 'En la calle', exacto: true, label: 'Kilómetros y tiempo en la calle, sin planillas' },
    ],
  },
  {
    nombre: 'um-d01-proxima', ruta: '/chofer', rol: 'chofer',
    zona: [{ t: 'Mi ruta de hoy' }, { t: 'llegada en', exacto: false }], margen: 18, extraAbajo: 16,
    notas: [
      { t: 'paradas resueltas', exacto: false, label: 'El avance del día en una línea' },
      { t: 'Próxima:', exacto: false, label: 'Lo único que importa ahora: la próxima entrega y cuánto falta' },
    ],
  },
  {
    nombre: 'um-d02-lista', ruta: '/chofer', rol: 'chofer',
    zona: [{ t: 'Kiosco La Esquina Azul' }, { t: 'Panadería La Espiga' }], margen: 22, extraAbajo: 30,
    notas: [
      { t: 'Entregada', exacto: true, n: 1, label: 'Lo hecho queda atenuado, pero a la vista' },
      { t: 'Próxima entrega', exacto: false, label: 'La próxima se destaca en lima, el único color de acento' },
      { t: 'en 20 min', exacto: true, label: 'Cada hora se corre sola si el camión se atrasa' },
    ],
  },
  {
    nombre: 'um-d03-parada', ruta: '/chofer/parada/p-03', rol: 'chofer',
    zona: [{ t: 'Nota del cliente', exacto: true }, { t: 'Cómo llegar', exacto: true }], margen: 18, extraAbajo: 14,
    notas: [
      { t: 'Nota del cliente', exacto: true, label: 'Lo que pidió el cliente, antes de bajar del camión' },
      { t: 'Entregar y firmar', exacto: true, label: 'Una acción principal grande; las demás, secundarias' },
      { t: 'No se pudo entregar', exacto: true, label: 'Lo que salió mal también se registra, en coral' },
    ],
  },
  {
    nombre: 'um-d04-firma', ruta: '/chofer/confirmar/p-03', rol: 'chofer',
    zona: [{ t: '2. Control de bultos' }, { t: 'Falta el control', exacto: false }], margen: 18, extraAbajo: 10,
    notas: [
      { t: '2. Control de bultos', exacto: true, label: 'Pasos numerados, en el orden en que pasan en la puerta' },
      { t: 'Pedile a quien recibe', exacto: false, label: 'La firma, con el dedo y en un recuadro grande' },
      { t: 'Falta el control', exacto: false, label: 'El botón no se habilita y dice qué falta' },
    ],
  },
  {
    nombre: 'um-d05-oscuro', ruta: '/chofer', rol: 'chofer', oscuro: true,
    zona: [{ t: 'Próxima:', exacto: false }, { t: '© OpenStreetMap' }], margen: 16, extraAbajo: 8,
    notas: [
      { t: 'Próxima:', exacto: false, label: 'Grafito y lima: se lee a pleno sol y de noche' },
      { t: '7', exacto: true, label: 'Lo que falta brilla en lima; lo ya recorrido, punteado' },
    ],
  },
  {
    nombre: 'um-d06-comprobante', ruta: '/cliente/pedido/BD-3988', rol: 'cliente',
    zona: [{ t: 'DISTRIBUIDORA BANDADA' }, { t: 'Bultos', exacto: true }], margen: 18, extraAbajo: 28,
    notas: [
      { t: 'entregado', exacto: false, label: 'El comprobante reemplaza al remito en papel' },
      { t: 'con firma', exacto: false, label: 'Quién recibió y si firmó: se acaban los «a mí no me llegó»' },
    ],
  },
];

// ---------- tarjetas de código ----------
const CODIGO = [
  {
    nombre: 'um-c01-estimar', titulo: 'Las horas se corren solas', ruta: 'src/utils/ruta.ts',
    codigo: `// Recorre la ruta en orden: lo resuelto toma la hora real; lo pendiente se estima.
export function estimarRuta(ruta: Ruta, entregas: Entregas, ahora: Date): ParadaEstimada[] {
  let salidaAnterior = new Date(ruta.salida);
  let hayPendienteAntes = false;
  return ruta.paradas.map((parada) => {
    const entrega = entregas[parada.id];
    if (entrega) {
      salidaAnterior = new Date(entrega.hora);
      return { parada, estado: entrega.estado, llegada: salidaAnterior };
    }
    let llegada = sumarMinutos(salidaAnterior, parada.minutosDeViaje);
    // la próxima nunca queda en el pasado: si el camión se atrasa, se corre todo lo que sigue
    if (!hayPendienteAntes && llegada < ahora) llegada = ahora;
    hayPendienteAntes = true;
    salidaAnterior = sumarMinutos(llegada, MINUTOS_POR_ENTREGA);
    return { parada, estado: 'pendiente', llegada };
  });
}`,
  },
  {
    nombre: 'um-c02-aviso', titulo: 'Un aviso que sigue al camión', ruta: 'src/hooks/useAvisoLlegada.ts',
    codigo: `// Si la llegada estimada se mueve más de 2 minutos, la notificación se vuelve a programar.
const TOLERANCIA_MS = 2 * 60_000;

useEffect(() => {
  if (!guardado || llegadaMs === null) return;
  if (!pendiente) {
    cancelarAviso(guardado.id);           // ya se entregó: no tiene que sonar
    return;
  }
  if (Math.abs(new Date(guardado.llegada).getTime() - llegadaMs) < TOLERANCIA_MS) return;
  cancelarAviso(guardado.id).then(async () => {
    const r = await programarAviso(new Date(llegadaMs), codigo);
    guardar({ codigo, llegada: new Date(llegadaMs).toISOString(), id: r.id });
  });
}, [guardado, llegadaMs, pendiente, codigo, guardar]);`,
  },
  {
    nombre: 'um-c03-mapa', titulo: 'Un mapa propio que corre en Expo Go', ruta: 'src/componentes/MapaRuta/MapaRuta.tsx',
    codigo: `// Mosaicos de OpenStreetMap + una capa SVG: sin SDK nativo de mapas.
const exacto = Math.min(ZOOM_MAXIMO, Math.max(ZOOM_MINIMO, base + ajusteZoom));
// los mosaicos vienen en zooms enteros: se pide el de abajo y se agranda hasta el zoom exacto
const zoom = Math.floor(exacto);
const escala = 2 ** (exacto - zoom);
const lado = TAMANO_MOSAICO * escala;

for (let tx = Math.floor(izquierda / lado); tx <= Math.floor((izquierda + ancho) / lado); tx++) {
  for (let ty = Math.floor(arriba / lado); ty <= Math.floor((arriba + alto) / lado); ty++) {
    mosaicos.push({
      clave: \`\${zoom}/\${tx}/\${ty}\`,
      uri: \`https://tile.openstreetmap.org/\${zoom}/\${tx}/\${ty}.png\`,
      x: tx * lado - izquierda,
      y: ty * lado - arriba,
    });
  }
}`,
  },
  {
    nombre: 'um-c04-plataformas', titulo: 'El mismo código en el teléfono y en la web', ruta: 'src/db/preferencias.ts · preferencias.web.ts',
    codigo: `// En el teléfono: kv-store de expo-sqlite
export async function guardarPreferencia(clave: string, valor: string): Promise<void> {
  try {
    await Storage.setItemAsync(clave, valor);
  } catch {
    // si falla, la preferencia vale sólo para esta sesión
  }
}

// En la web (Metro elige el archivo .web.ts solo): localStorage
export async function guardarPreferencia(clave: string, valor: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(clave, valor);
  } catch {
    // sin almacenamiento disponible
  }
}`,
  },
];

const PALABRAS = /\b(export|function|const|let|return|if|else|async|await|new|throw|import|from|for|of|in|true|false|null|type|useEffect|useCallback)\b/g;

function resaltar(linea) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const comentario = linea.match(/^(\s*)(\/\/.*|#.*)$/);
  if (comentario) return `${comentario[1]}<span class="c">${esc(comentario[2])}</span>`;
  // separa strings del resto para no colorear palabras dentro de ellas
  return linea.split(/('[^']*'|`[^`]*`|"[^"]*")/).map((parte, i) => {
    if (i % 2 === 1) return `<span class="s">${esc(parte)}</span>`;
    const [codigo, resto] = parte.split(/(?=\s\/\/)/);
    const coloreado = esc(codigo).replace(PALABRAS, '<span class="k">$1</span>').replace(/\b([A-Z][A-Za-z]+)\b/g, '<span class="t">$1</span>');
    return resto ? `${coloreado}<span class="c">${esc(resto)}</span>` : coloreado;
  }).join('');
}

async function tarjetaCodigo(browser, { titulo, ruta, codigo }, file) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 400 }, deviceScaleFactor: 2 });
  await page.setContent(`<!doctype html><html><head><style>
    body{margin:0;background:#0b0614;padding:24px;font-family:Inter,system-ui,sans-serif;width:fit-content}
    .card{background:#1e1530;border:1px solid #6d4aa8;border-radius:22px;box-shadow:0 0 40px rgba(124,58,237,.25);min-width:900px}
    .bar{display:flex;align-items:center;gap:10px;padding:18px 24px;border-bottom:1px solid #2f2445}
    .dot{width:14px;height:14px;border-radius:50%}
    .titulo{color:#e9e3f5;font-weight:700;font-size:20px;margin-left:12px}
    .ruta{margin-left:auto;color:#a99cc4;font:15px 'JetBrains Mono',ui-monospace,monospace;padding-left:30px}
    pre{margin:0;padding:22px 28px 26px;color:#ece8f4;font:15.5px/1.7 'JetBrains Mono','Fira Code',ui-monospace,monospace;white-space:pre}
    .k{color:#f0abfc}.s{color:#86efac}.c{color:#9a8fb3;font-style:italic}.t{color:#93c5fd}
  </style></head><body><div class="card">
    <div class="bar"><span class="dot" style="background:#f472b6"></span><span class="dot" style="background:#c084fc"></span><span class="dot" style="background:#8b5cf6"></span>
    <span class="titulo">${titulo}</span><span class="ruta">${ruta}</span></div>
    <pre>${codigo.split('\n').map(resaltar).join('\n')}</pre></div></body></html>`);
  const caja = await page.locator('body').boundingBox();
  await page.setViewportSize({ width: Math.ceil(caja.width), height: Math.ceil(caja.height) });
  await page.screenshot({ path: file });
  await page.close();
}

async function arquitectura(browser, file) {
  const caja = (titulo, sub, color) => `<div class="caja" style="border-color:${color}"><strong>${titulo}</strong><span>${sub}</span></div>`;
  const page = await browser.newPage({ viewport: { width: 1200, height: 600 }, deviceScaleFactor: 2 });
  await page.setContent(`<!doctype html><html><head><style>
    body{margin:0;padding:40px;background:linear-gradient(135deg,#F5F3FF,#E0F2FE);font-family:Inter,system-ui,sans-serif;width:fit-content}
    .lienzo{background:#fff;border-radius:22px;padding:34px 38px;box-shadow:0 20px 50px rgba(76,29,149,.18);display:grid;grid-template-columns:repeat(4,220px);gap:22px 44px;align-items:center}
    .caja{border:3px solid;border-radius:18px;padding:16px 18px;display:flex;flex-direction:column;gap:6px;background:#fff}
    .caja strong{font-size:19px;color:#1e1b2e}.caja span{font-size:14.5px;color:#4b4560;line-height:1.4}
    h2{grid-column:1/-1;margin:0 0 4px;font-size:22px;color:#1e1b2e}
  </style></head><body><div class="lienzo">
    <h2>Última Milla · cómo se arma la pantalla</h2>
    ${caja('Pantallas', 'Expo Router · bienvenida, login, chofer y cliente con pestañas', '#0EA5E9')}
    ${caja('Componentes', 'Botones, tarjetas, estados, firma y mapa · cada uno con su .estilos.ts', '#0EA5E9')}
    ${caja('Tema', 'Paleta grafito + lima, medidas, claro / oscuro / sistema', '#0EA5E9')}
    ${caja('Hooks', 'useSesion · useJornada · useRuta · useAvisoLlegada', '#7c3aed')}
    ${caja('Estado del día', 'useJornada: lo que marca el chofer lo ve el cliente', '#7c3aed')}
    ${caja('Lógica pura', 'utils/ruta.ts y geo.ts: horas, posición del camión, resumen · con tests', '#7c3aed')}
    ${caja('Servicios', '«API» simulada con latencia, sesión y compartir', '#7c3aed')}
    ${caja('Datos simulados', 'Distribuidora Bandada: clientes, pedidos e historial ficticios', '#7c3aed')}
    ${caja('Notificaciones', 'expo-notifications · en la web, aviso dentro de la pantalla', '#F59E0B')}
    ${caja('Preferencias', 'kv-store en el teléfono · localStorage en la web', '#F59E0B')}
    ${caja('Mapa', 'Mosaicos de OpenStreetMap + capa SVG', '#F59E0B')}
    ${caja('Expo Go · Web · EAS', 'Android, iOS y navegador con el mismo código', '#64748b')}
  </div></body></html>`);
  const box = await page.locator('body').boundingBox();
  await page.setViewportSize({ width: Math.ceil(box.width), height: Math.ceil(box.height) });
  await page.screenshot({ path: file });
  await page.close();
}

// ---------- capturas anotadas ----------
async function entrar(page, rol) {
  await page.goto(`${BASE}/login`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('ultimamilla.bienvenida', 'si'); });
  if (!rol) return;
  await page.goto(`${BASE}/login`);
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: rol === 'chofer' ? /Soy chofer/ : /Soy cliente/ }).click();
  await page.waitForURL(`**/${rol}`);
}

function locator(page, nota) {
  const loc = nota.s ? page.locator(nota.s) : page.getByText(nota.t, { exact: Boolean(nota.exacto) });
  return nota.n === -1 ? loc.last() : loc.nth(nota.n ?? 0);
}

async function rect(page, nota) {
  const handle = await locator(page, nota).elementHandle({ timeout: 4000 }).catch(() => null);
  if (!handle) return null;
  const r = await handle.evaluate((el) => {
    const b = el.getBoundingClientRect();
    return { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height };
  });
  // un punto dentro del elemento (por ejemplo, una zona de un gráfico)
  if (nota.fx !== undefined) return { x: r.x + r.w * nota.fx, y: r.y + r.h * nota.fy, w: 1, h: 1 };
  return r;
}

const ANCHO_IMAGEN = 620;
const ANCHO_ETIQUETA = 360;

async function componer(browser, png, clip, notas, file) {
  const k = Math.min(1.6, ANCHO_IMAGEN / clip.width);
  const pad = 40;
  const imgW = clip.width * k;
  const imgH = clip.height * k;
  const lx = pad + imgW + 70;
  const W = Math.ceil(lx + ANCHO_ETIQUETA + pad);
  const pts = notas.map((n) => {
    const cx = n.x - clip.x;
    const cy = n.y - clip.y;
    let tx = cx + n.w + 8;
    let ty = cy + n.h / 2;
    if (n.en === 'arriba') [tx, ty] = [cx + n.w / 2, cy - 8];
    if (n.en === 'abajo') [tx, ty] = [cx + n.w / 2, cy + n.h + 8];
    if (n.en === 'centro') [tx, ty] = [cx + n.w / 2, cy + n.h / 2];
    tx = pad + Math.max(4, Math.min(clip.width - 4, tx)) * k;
    ty = pad + Math.max(4, Math.min(clip.height - 4, ty)) * k;
    return { label: n.label, color: n.alerta ? '#F59E0B' : '#0EA5E9', tx, ty };
  });
  // numeradas de arriba hacia abajo, en el orden en que se leen
  pts.sort((a, b) => a.ty - b.ty).forEach((p, i) => (p.i = i + 1));
  console.log(pts.map((p) => `    ${p.i}. ${p.label}`).join('\n'));
  const page = await browser.newPage({ viewport: { width: W, height: 400 }, deviceScaleFactor: 2 });
  await page.setContent(`<!doctype html><html><head><style>
    body{margin:0;width:${W}px;background:linear-gradient(135deg,#F5F3FF,#E0F2FE);font-family:Inter,system-ui,sans-serif;position:relative}
    img{position:absolute;left:${pad}px;top:${pad}px;width:${imgW}px;border-radius:18px;box-shadow:0 20px 50px rgba(76,29,149,.25),0 0 0 1px rgba(14,165,233,.25)}
    .tag{position:absolute;left:${lx}px;width:${ANCHO_ETIQUETA}px;box-sizing:border-box;display:flex;align-items:flex-start;gap:12px;padding:14px 18px;border-radius:20px;color:#fff;font-weight:600;font-size:22px;line-height:1.3;box-shadow:0 8px 20px rgba(15,23,42,.18)}
    .n{flex:none;width:32px;height:32px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:18px;font-weight:800}
    svg{position:absolute;left:0;top:0;overflow:visible}
  </style></head><body>
    <img src="data:image/png;base64,${png.toString('base64')}" />
    ${pts.map((p) => `<div class="tag" style="background:${p.color}"><span class="n" style="color:${p.color}">${p.i}</span><span>${p.label}</span></div>`).join('')}
    <svg id="flechas"></svg>
  </body></html>`);
  // etiquetas apiladas a la altura de su punto, sin superponerse
  await page.evaluate(({ pts, pad, imgH, lx }) => {
    const tags = [...document.querySelectorAll('.tag')];
    const orden = pts.map((p, i) => ({ ...p, el: tags[i] })).sort((a, b) => a.ty - b.ty);
    let piso = pad;
    for (const p of orden) {
      const h = p.el.offsetHeight;
      p.top = Math.max(piso, p.ty - h / 2);
      p.el.style.top = `${p.top}px`;
      p.sy = p.top + Math.min(h / 2, 30);
      piso = p.top + h + 16;
    }
    const H = Math.ceil(Math.max(pad * 2 + imgH, piso + pad - 16));
    document.body.style.height = `${H}px`;
    const svg = document.getElementById('flechas');
    svg.setAttribute('width', document.body.offsetWidth);
    svg.setAttribute('height', H);
    svg.innerHTML = orden.map((p) => {
      const sx = lx - 4;
      const mx = (sx + p.tx) / 2;
      return `<path d="M${sx},${p.sy} C${mx},${p.sy} ${mx},${p.ty} ${p.tx},${p.ty}" stroke="${p.color}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="${p.tx}" cy="${p.ty}" r="9" fill="${p.color}" stroke="#fff" stroke-width="3"/>`;
    }).join('');
  }, { pts, pad, imgH, lx });
  const alto = await page.evaluate(() => document.body.offsetHeight);
  await page.setViewportSize({ width: W, height: alto });
  await page.screenshot({ path: file });
  await page.close();
}


const browser = await chromium.launch();
for (const cap of CAPTURAS) {
  if (SOLO && cap.nombre !== SOLO) continue;
  const contexto = await browser.newContext({ viewport: TELEFONO, deviceScaleFactor: 2, locale: 'es-AR', colorScheme: cap.oscuro ? 'dark' : 'light' });
  const page = await contexto.newPage();
  await entrar(page, cap.rol);
  await page.goto(BASE + cap.ruta);
  await page.waitForLoadState('networkidle');
  // los mosaicos del mapa y la latencia simulada de la API terminan un rato después
  await page.waitForTimeout(2500);
  let clip = cap.clip;
  if (cap.zona) {
    const rs = [];
    for (const z of cap.zona) {
      const r = await rect(page, z);
      if (!r) throw new Error(`${cap.nombre}: no encontré la zona ${z.s ?? z.t}`);
      rs.push(r);
    }
    const m = cap.margen ?? 16;
    const x = Math.min(...rs.map((r) => r.x)) - m;
    const y = Math.min(...rs.map((r) => r.y)) - m - (cap.extraArriba ?? 0);
    const x2 = Math.max(...rs.map((r) => r.x + r.w)) + m;
    const y2 = Math.max(...rs.map((r) => r.y + r.h)) + m + (cap.extraAbajo ?? 0);
    // en el teléfono el recorte toma todo el ancho de la pantalla
    clip = { x: 0, y: Math.max(0, y), width: TELEFONO.width, height: y2 - Math.max(0, y) };
  }
  clip = { x: Math.round(clip.x), y: Math.round(clip.y), width: Math.round(clip.width), height: Math.round(clip.height) };
  const notas = [];
  for (const n of cap.notas) {
    const r = await rect(page, n);
    if (r) notas.push({ ...n, ...r });
    else console.warn('  sin elemento:', cap.nombre, n.label);
  }
  const png = await page.screenshot({ clip, fullPage: true });
  await componer(browser, png, clip, notas, join(OUT, `${cap.nombre}.png`));
  console.log('ok', cap.nombre, `${notas.length}/${cap.notas.length}`, `${clip.width}×${clip.height}`);
  await contexto.close();
}

for (const c of CODIGO) {
  if (SOLO && c.nombre !== SOLO) continue;
  await tarjetaCodigo(browser, c, join(OUT, `${c.nombre}.png`));
  console.log('ok', c.nombre);
}

if (!SOLO || SOLO === 'um-a01-arquitectura') {
  await arquitectura(browser, join(OUT, 'um-a01-arquitectura.png'));
  console.log('ok um-a01-arquitectura');
}

await browser.close();
