# Genera respuestas SIMULADAS del card sorting para los dos roles (8 participantes cada uno).
import csv, random
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent / 'card-sorting'
random.seed(2411)
ESTUDIOS = {
    'chofer': {
        'base': {'Hoy': [1, 2, 3, 4, 5], 'En la parada': [6, 7, 8, 9, 10], 'Entregar': [11, 12],
                 'Mi día': [13, 14, 15, 16], 'Cuenta': [17, 18]},
        'nombres': {'Hoy': ['Ruta', 'Mi ruta', 'Hoy', 'Ruta'], 'En la parada': ['Parada', 'Cliente', 'Pedido', 'Parada'],
                    'Entregar': ['Entregar', 'Entregas', 'Confirmar'], 'Mi día': ['Resumen', 'Mi día', 'Estadísticas'],
                    'Cuenta': ['Perfil', 'Ajustes', 'Cuenta']},
        'ruido': [(6, 'Hoy'), (7, 'Entregar'), (9, 'Entregar'), (1, 'En la parada'), (12, 'En la parada'), (14, 'Hoy')],
        'fusion': ('Entregar', 'En la parada'),
    },
    'comercio': {
        'base': {'Mi pedido': [1, 2, 3, 4, 5, 6], 'Historial': [7, 8, 9], 'Cuenta': [10, 11, 12]},
        'nombres': {'Mi pedido': ['Mi pedido', 'Pedido de hoy', 'Seguimiento'], 'Historial': ['Historial', 'Mis pedidos', 'Comprobantes'],
                    'Cuenta': ['Perfil', 'Ajustes', 'Ayuda']},
        'ruido': [(5, 'Historial'), (6, 'Cuenta'), (12, 'Mi pedido'), (9, 'Mi pedido')],
        'fusion': None,
    },
}
for rol, e in ESTUDIOS.items():
    filas = []
    for p in range(1, 9):
        grupos = {g: list(ts) for g, ts in e['base'].items()}
        for t, destino in e['ruido']:
            if random.random() < 0.3:
                origen = next(g for g, ts in grupos.items() if t in ts)
                grupos[origen].remove(t); grupos[destino].append(t)
        if e['fusion'] and random.random() < 0.4:
            a, b = e['fusion']; grupos[b] += grupos.pop(a)
        for g, ts in grupos.items():
            nombre = random.choice(e['nombres'][g])
            filas += [{'participante': f'{rol[0].upper()}{p:02d}', 'tarjeta': t, 'grupo': nombre} for t in ts]
    with open(RAIZ / f'SIMULADO-respuestas-{rol}.csv', 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=['participante', 'tarjeta', 'grupo']); w.writeheader(); w.writerows(filas)
    print(rol, len(filas), 'filas')
