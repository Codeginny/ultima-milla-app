# Genera resultados SIMULADOS del test «antes» (3 choferes + 3 comercios) y los resume.
import csv, random
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent / 'test-usabilidad'
random.seed(2411)
# tarea: (rol, p. directo, p. indirecto, segundos, clics de más, facilidad 1–7). Supuestos coherentes con la auditoría.
TAREAS = {'T1': ('chofer', 0.34, 0.5, 38, 3, 4.3), 'T2': ('chofer', 0.5, 0.5, 52, 2, 4.7),
          'T3': ('chofer', 0.34, 0.33, 44, 3, 4.0), 'T4': ('comercio', 1.0, 0.0, 12, 0, 6.3),
          'T5': ('comercio', 0.34, 0.33, 35, 3, 4.0), 'T6': ('comercio', 0.67, 0.33, 27, 1, 5.3)}
filas, sus = [], []
for rol, pre in [('chofer', 'C'), ('comercio', 'K')]:
    for p in range(1, 4):
        pid = f'{pre}{p:02d}'
        for t, (r, d, i, tm, cl, fa) in TAREAS.items():
            if r != rol:
                continue
            x = random.random()
            res = 'directo' if x < d else 'indirecto' if x < d + i else 'abandono'
            filas.append({'participante': pid, 'rol': rol, 'tarea': t, 'resultado': res,
                          'segundos': max(6, round(random.gauss(tm, tm * 0.3))),
                          'clics_de_mas': 0 if res == 'directo' else max(1, round(random.gauss(cl, 1))),
                          'facilidad_1a7': min(7, max(1, round(random.gauss(fa, 0.9))))})
        resp = [min(5, max(1, round(random.gauss(3.6 if q % 2 else 2.4, 0.7)))) for q in range(1, 11)]
        punt = sum((v - 1) if q % 2 else (5 - v) for q, v in zip(range(1, 11), resp)) * 2.5
        sus.append({'participante': pid, 'rol': rol, **{f'p{q}': v for q, v in enumerate(resp, 1)}, 'sus': punt})
for nombre, datos in [('SIMULADO-resultados-antes.csv', filas), ('SIMULADO-sus-antes.csv', sus)]:
    with open(RAIZ / nombre, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=datos[0].keys()); w.writeheader(); w.writerows(datos)

lineas = ['# Test «antes» — resumen · DATOS SIMULADOS', '', '> ⚠️ Inventado para avanzar. Se reemplaza por el export real de Maze.', '',
          '| Tarea | Rol | Éxito total | Directo | Tiempo medio | Clics de más | Facilidad (1–7) |', '|---|---|---|---|---|---|---|']
for t, (rol, *_ ) in TAREAS.items():
    f_ = [x for x in filas if x['tarea'] == t]; n = len(f_)
    ok = sum(x['resultado'] != 'abandono' for x in f_); di = sum(x['resultado'] == 'directo' for x in f_)
    lineas.append(f"| {t} | {rol} | {ok/n:.0%} | {di/n:.0%} | {sum(x['segundos'] for x in f_)/n:.0f} s | "
                  f"{sum(x['clics_de_mas'] for x in f_)/n:.1f} | {sum(x['facilidad_1a7'] for x in f_)/n:.1f} |")
for rol in ('chofer', 'comercio'):
    s = [x['sus'] for x in sus if x['rol'] == rol]
    lineas.append(f'\n**SUS {rol}:** {sum(s)/len(s):.1f} / 100')
lineas.append(f"\n**SUS general:** {sum(x['sus'] for x in sus)/len(sus):.1f} / 100 (68 es el promedio de referencia).")
(RAIZ / 'SIMULADO-resumen-antes.md').write_text('\n'.join(lineas) + '\n')
print('\n'.join(lineas))
