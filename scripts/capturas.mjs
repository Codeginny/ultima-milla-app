// Saca las capturas del README recorriendo la app en Expo Web con Playwright.
// Uso: con `npm run web` levantado, `node scripts/capturas.mjs` (BASE_URL cambia el puerto).
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:8081';
const SALIDA = new URL('../docs/capturas/', import.meta.url).pathname;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function nuevaPagina(navegador, esquema) {
  const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: esquema, locale: 'es-AR' });
  const pagina = await contexto.newPage();
  return pagina;
}

async function foto(pagina, nombre, completa = false) {
  await esperar(900);
  await pagina.screenshot({ path: `${SALIDA}${nombre}.png`, fullPage: completa });
  console.log('✓', nombre);
}

async function ir(pagina, ruta) {
  await pagina.goto(`${BASE}${ruta}`);
  await pagina.waitForLoadState('networkidle');
  await esperar(1200);
}

await mkdir(SALIDA, { recursive: true });
const navegador = await chromium.launch();

for (const esquema of ['light', 'dark']) {
  const sufijo = esquema === 'dark' ? '-oscuro' : '';
  const p = await nuevaPagina(navegador, esquema);
  await ir(p, '/login');
  await p.evaluate(() => localStorage.clear());

  if (esquema === 'light') {
    await ir(p, '/');
    await foto(p, '01-bienvenida-que-es');
    await p.getByRole('button', { name: 'Siguiente' }).click();
    await foto(p, '02-bienvenida-chofer');
    await p.getByRole('button', { name: 'Siguiente' }).click();
    await foto(p, '03-bienvenida-cliente');
    await p.getByRole('button', { name: 'Empezar' }).click();
    await esperar(800);
    await foto(p, '04-login', true);
  } else {
    await p.evaluate(() => localStorage.setItem('ultimamilla.bienvenida', 'si'));
    await ir(p, '/login');
  }

  // Chofer
  await p.getByRole('button', { name: /Soy chofer/ }).click();
  await p.waitForURL('**/chofer');
  await esperar(1500);
  await foto(p, `05-chofer-ruta${sufijo}`);
  if (esquema === 'light') {
    await foto(p, '06-chofer-ruta-completa', true);
    await ir(p, '/chofer/parada/p-03');
    await foto(p, '07-chofer-parada', true);
    await ir(p, '/chofer/confirmar/p-03');
    await p.getByRole('checkbox').click();
    const lienzo = await p.getByLabel('Recuadro para firmar').boundingBox();
    if (lienzo) {
      await p.mouse.move(lienzo.x + 40, lienzo.y + 110);
      await p.mouse.down();
      for (const [dx, dy] of [[70, 70], [100, 120], [130, 60], [170, 115], [210, 70], [250, 100], [290, 80]]) {
        await p.mouse.move(lienzo.x + dx, lienzo.y + dy, { steps: 6 });
      }
      await p.mouse.up();
    }
    await foto(p, '08-chofer-confirmar-firma', true);
    await p.getByRole('button', { name: 'Confirmar entrega' }).click();
    await esperar(1200);
  }
  await ir(p, '/chofer/resumen');
  await foto(p, `09-chofer-resumen${sufijo}`, esquema === 'light');

  // Cliente
  await p.evaluate(() => localStorage.removeItem('ultimamilla.sesion'));
  await ir(p, '/login');
  await p.getByRole('button', { name: /Soy cliente/ }).click();
  await p.waitForURL('**/cliente');
  await esperar(1500);
  await foto(p, `10-cliente-pedido${sufijo}`);
  if (esquema === 'light') {
    await p.getByRole('button', { name: /Avisarme 10 minutos antes/ }).click();
    await foto(p, '11-cliente-pedido-completo', true);
    await ir(p, '/cliente/pedidos');
    await foto(p, '12-cliente-historial');
    await ir(p, '/cliente/pedido/BD-3988');
    await foto(p, '13-cliente-comprobante');
    await ir(p, '/cliente/perfil');
    await foto(p, '14-perfil', true);
  }
  await p.context().close();
}

await navegador.close();
