# Matriz de similitud y dendrograma del card sorting.
# Uso: python analizar_card_sorting.py <respuestas.csv> <tarjetas-ROL.csv>
import sys
from pathlib import Path
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import linkage, dendrogram, fcluster
from scipy.spatial.distance import squareform

RAIZ = Path(__file__).resolve().parent.parent
entrada = Path(sys.argv[1])
ruta_tarjetas = Path(sys.argv[2])
rol = ruta_tarjetas.stem.replace('tarjetas-', '')
simulado = 'SIMULADO' in entrada.name
pref = ('SIMULADO-' if simulado else '') + rol + '-'
r = pd.read_csv(entrada)
tarjetas = pd.read_csv(ruta_tarjetas).set_index('id')['tarjeta']
ids = list(tarjetas.index)
n = r['participante'].nunique()

# % de participantes que pusieron cada par en el mismo grupo
sim = pd.DataFrame(0.0, index=ids, columns=ids)
for _, g in r.groupby(['participante', 'grupo']):
    ts = list(g['tarjeta'])
    for a in ts:
        for b in ts:
            sim.loc[a, b] += 1
sim = sim / n
sim.round(2).to_csv(RAIZ / f'card-sorting/{pref}matriz-similitud.csv')

Z = linkage(squareform(1 - sim.values, checks=False), 'average')
etiquetas = [f'{i}. {tarjetas[i]}' for i in ids]
fig, ax = plt.subplots(figsize=(11, 7))
dendrogram(Z, labels=etiquetas, orientation='right', color_threshold=0.6, ax=ax)
ax.set_xlabel('Distancia (1 − % de acuerdo)')
ax.set_title(f'Card sorting de Última Milla ({rol}) · {n} participantes' + (' · DATOS SIMULADOS' if simulado else ''))
plt.tight_layout(); plt.savefig(RAIZ / f'card-sorting/{pref}dendrograma.png', dpi=150)

grupos = fcluster(Z, 0.6, 'distance')
nombres = r.groupby('tarjeta')['grupo'].agg(lambda s: s.mode()[0])
lineas = [f'# Grupos sugeridos ({n} participantes){" — DATOS SIMULADOS" if simulado else ""}\n']
for k in sorted(set(grupos)):
    miembros = [i for i, g in zip(ids, grupos) if g == k]
    nombre = r[r['tarjeta'].isin(miembros)]['grupo'].mode()[0]
    acuerdo = sim.loc[miembros, miembros].values.mean()
    lineas.append(f'\n## {nombre} (acuerdo medio {acuerdo:.0%})')
    lineas += [f'- {i}. {tarjetas[i]}' for i in miembros]
dificiles = [i for i in ids if sim.loc[i].drop(i).max() < 0.5]
lineas.append('\n## Tarjetas sin acuerdo claro (< 50 % con cualquier otra)')
lineas += [f'- {i}. {tarjetas[i]}' for i in dificiles] or ['- Ninguna']
(RAIZ / f'card-sorting/{pref}resultados.md').write_text('\n'.join(lineas) + '\n')
print('\n'.join(lineas))
