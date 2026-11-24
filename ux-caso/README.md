# Caso UX de Última Milla

**Figma:** [Última Milla UX — caso integral](https://www.figma.com/design/u6B0QrGlwaeiXEQB8Fp23e) · página 1: pantallas reales · 2: wireframes · 3: prototipo y test.

Auditoría, investigación y rediseño de la app, en 4 sprints. Se cuenta en 5 fichas del portfolio: Producto, Diseño & UX/UI, Full-Stack, Datos & BI y Gestión.

| Carpeta | Qué hay |
|---|---|
| `investigacion/` | Formulario para choferes y comercios (Google Forms), respuestas, proto-personas y journeys |
| `capturas/antes/` | Pantallas actuales (copia de `docs/capturas/`) |
| `auditoria/` | Auditoría heurística con hallazgos priorizados y capturas marcadas |
| `card-sorting/` | Tarjetas, plan y análisis (matriz de similitud y dendrograma) |
| `test-usabilidad/` | Test «antes»: tareas, métricas y SUS |
| `gestion/` | Backlog para Jira y plan de sprints |
| `rediseno/` | Nuevo mapa de navegación y wireframes de las 5 pantallas clave (`wireframes.html` → PNG) |
| `herramientas/` | Scripts de marcado, simulación y análisis |

## ⚠️ Datos simulados
Todo archivo con **SIMULADO** en el nombre es inventado para avanzar con el diseño mientras llegan las respuestas reales, y **no se publica como real**. Para reemplazarlos:
1. Entrevistas: exportar las respuestas del formulario y rehacer `investigacion/respuestas/` y `proto-personas.md`.
2. Card sorting: guardar cada export como `card-sorting/respuestas-chofer.csv` / `respuestas-comercio.csv` y correr `.venv/bin/python herramientas/analizar_card_sorting.py card-sorting/respuestas-chofer.csv card-sorting/tarjetas-chofer.csv` (igual para comercio).
3. Test: guardar el export de Maze como `test-usabilidad/resultados-antes.csv`.

Para el análisis en Python: `python3 -m venv .venv && .venv/bin/pip install pandas scipy matplotlib`.

## Rediseño implementado (24/11)
Capturas en `capturas/despues/` (mismo script: `SALIDA=$PWD/ux-caso/capturas/despues/ npm run capturas`).

| Hallazgo | Cambio en el código |
|---|---|
| 1, 2 | Parada: acciones «Cómo llegar · Avisar · Llamar» arriba (64 px) y «Entregar y firmar» / «No se pudo entregar» fijos abajo (`Pantalla` con `pie`) |
| 3 | Barra de pestañas con texto en todas |
| 5 | Ruta: tarjeta «Próxima entrega» con «Ir» y «Entregar» (`Tarjeta destacada`) |
| 6 | Controles del mapa de 48 px |
| 7 | Recorrido hecho `#6b726d` (4,5:1 en claro) |
| 8 | Nuevo token `bordeControl` (3,4:1) en campos y casillas |
| 9 | Confirmar entrega: pasos con ✓ y pie fijo «Paso N de 3 · falta …» |
| 10 | Nueva pantalla `chofer/no-entregada/[id]`: motivo + foto opcional (`expo-image-picker`) |
| 11 | Aviso 10 minutos antes activado por defecto y antes del mapa |

Pendientes de la auditoría: 4 (ya estaba resuelto por `Pantalla conTabs`), 12, 13 y 14.
