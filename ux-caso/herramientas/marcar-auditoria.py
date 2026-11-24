# Marca los hallazgos de la auditoría (píldoras ámbar numeradas) sobre las capturas en modo claro.
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FUENTE = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 34)
# hallazgo, captura, x, y (en px de la pantalla de 390 de ancho)
MARCAS = [
    (5, '05-chofer-ruta', 370, 290), (6, '05-chofer-ruta', 300, 368), (3, '05-chofer-ruta', 325, 797),
    (4, '05-chofer-ruta', 30, 790), (1, '07-chofer-parada', 365, 760), (7, '07-chofer-parada', 200, 285),
    (8, '08-chofer-confirmar-firma', 365, 280), (9, '08-chofer-confirmar-firma', 365, 780),
    (13, '09-chofer-resumen', 365, 225), (11, '10-cliente-pedido', 370, 615), (14, '12-cliente-historial', 365, 115),
    (12, '04-login', 365, 795),
]
por = {}
for n, p, x, y in MARCAS:
    por.setdefault(p, []).append((n, x * 2, y * 2))
for p, marcas in por.items():
    img = Image.open(RAIZ / f'capturas/antes/{p}.png').convert('RGB')
    d = ImageDraw.Draw(img)
    for n, x, y in marcas:
        r = max(30, d.textlength(str(n), font=FUENTE) / 2 + 18)
        d.rounded_rectangle((x - r, y - 30, x + r, y + 30), radius=30, fill='#f59e0b', outline='white', width=6)
        d.text((x, y), str(n), font=FUENTE, fill='#331a00', anchor='mm')
    img.save(RAIZ / f'auditoria/capturas/{p}-hallazgos.png')
print(len(MARCAS), 'marcas')
