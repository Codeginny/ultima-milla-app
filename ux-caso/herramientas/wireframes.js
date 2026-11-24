// Renderiza rediseno/wireframes.html a PNG (todas juntas y una por pantalla).
// Uso: NODE_PATH=<carpeta con playwright> node wireframes.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
	const dir = path.join(__dirname, '../rediseno');
	const b = await chromium.launch();
	const p = await b.newPage({ viewport: { width: 2200, height: 1000 }, deviceScaleFactor: 2 });
	await p.goto('file://' + path.join(dir, 'wireframes.html'));
	await p.screenshot({ path: path.join(dir, 'wireframes.png'), fullPage: true });
	const ws = await p.$$('.w');
	const nombres = ['a-ruta', 'b-parada', 'c-confirmar', 'd-no-se-pudo', 'e-mi-pedido'];
	for (let i = 0; i < ws.length; i++) await ws[i].screenshot({ path: path.join(dir, `wireframe-${nombres[i]}.png`) });
	await b.close();
})();
