# Auditoría heurística de Última Milla (antes del rediseño)

**Qué se revisó:** las 13 pantallas actuales (bienvenida, login, chofer y cliente; capturas en `capturas/antes/`) y las tareas clave de cada rol. Chofer: ir a la próxima parada, confirmar una entrega, registrar una no entrega. Comercio: saber cuándo llega el pedido y activar el aviso.
**Cómo:** las 10 heurísticas de Nielsen, WCAG 2.2 AA y el contexto real de uso del chofer: celular en el soporte, una mano, guantes y sol. Es una revisión mía: el test «antes» confirma o descarta cada hallazgo.
**Gravedad:** 1 cosmético · 2 menor · 3 mayor · 4 bloquea la tarea.

## Resumen
- **14 hallazgos:** 4 de gravedad 3, 7 de gravedad 2 y 3 de gravedad 1. Ninguno bloquea.
- **Lo que funciona:** la ruta muestra el avance y la hora estimada que se corre sola; la confirmación pide nombre, bultos y firma antes de habilitar el botón; el comercio ve «llega en 23 min · antes hay 1 entrega», que responde exactamente su pregunta; el contraste del texto y de los botones grafito sobre lima es muy alto (15:1).
- **Lo que más pesa:** en la pantalla de la parada, las acciones que el chofer necesita están al final y en el orden inverso al del recorrido; la barra de pestañas tapa contenido y sus íconos inactivos no tienen texto.

## Hallazgos priorizados

| # | Pantalla | Hallazgo | Heurística | Grav. | Propuesta |
|---|---|---|---|---|---|
| 1 | Parada (chofer) | Las cuatro acciones (Entregar y firmar, No se pudo entregar, Avisar al cliente, Cómo llegar) están al final, debajo del mapa, la hora, el contacto, el pedido y la nota. Con el celular en el soporte hay que scrollear para la acción principal. | Flexibilidad y eficiencia | 3 | Botón «Entregar y firmar» fijo abajo; el resto en una fila de acciones arriba |
| 2 | Parada (chofer) | El orden de las acciones es el inverso al del trabajo: «Cómo llegar» y «Avisar al cliente» se usan antes de llegar y están últimos. | Coincidencia con el mundo real | 2 | Orden del recorrido: Cómo llegar → Avisar → Entregar |
| 3 | Todas las pestañas | La barra flotante muestra sólo el ícono en las pestañas inactivas (Resumen, Perfil, Historial). | Reconocer antes que recordar | 2 | Texto en todas las pestañas |
| 4 | Ruta, Resumen, Mi pedido | La barra flotante tapa la última fila de la lista y el contenido de abajo («Tu pedido», la línea de tiempo). | Visibilidad / estética | 2 | Margen inferior igual a la altura de la barra |
| 5 | Ruta (chofer) | La «Próxima» parada usa el estilo de alerta (triángulo y borde de aviso), que se lee como un problema y no como la tarea siguiente. | Consistencia y estándares | 2 | Tarjeta propia de «Próxima entrega» con la acción «Ir» |
| 6 | Ruta (chofer) | Los controles del mapa (+ y −) miden 36 px; con guantes o en movimiento cuestan. | Accesibilidad (WCAG 2.5.8) | 2 | 48 px mínimo para todo lo que toca el chofer |
| 7 | Mapas | El recorrido hecho es gris `#9aa19c` sobre el mapa claro (2,4:1) y no se distingue al sol. | Accesibilidad (WCAG 1.4.11) | 3 | Mínimo 3:1, o trazo punteado con borde |
| 8 | Campos y tarjetas (claro) | El borde de campos y tarjetas mide 1,4:1 contra el blanco: al sol, el campo «Nombre» de Confirmar casi no se ve. | Accesibilidad (WCAG 1.4.11) | 3 | Borde de 3:1 como mínimo en los campos |
| 9 | Confirmar entrega | Firma, bultos y nombre están en una sola pantalla larga, sin indicar cuántos pasos faltan para que se habilite «Confirmar entrega». | Visibilidad del estado | 2 | Pasos numerados con check (1/3, 2/3, 3/3) y botón que diga qué falta |
| 10 | Parada / No se pudo | «No se pudo entregar» no pide evidencia; las entrevistas muestran que hoy se manda una foto. | Prevención de errores | 2 | Motivo + foto opcional |
| 11 | Mi pedido (comercio) | El aviso 10 minutos antes hay que activarlo a mano y el botón está debajo del mapa. | Flexibilidad y eficiencia | 3 | Activado por defecto, con opción de apagarlo |
| 12 | Login | Para la demo están bien las tarjetas «Soy chofer / Soy cliente», pero el inicio con usuario queda abajo del todo y en un producto real es el camino principal. | Consistencia con el uso real | 1 | Separar «Probar la demo» del ingreso con usuario |
| 13 | Resumen | «Dentro de la franja 100 %» no aclara de qué franja se trata. | Coincidencia con el mundo real | 1 | «A tiempo según la franja del cliente: 100 %» |
| 14 | Historial (comercio) | El pedido de hoy aparece también en la pestaña Pedido; dos lugares para lo mismo. | Diseño minimalista | 1 | Historial sólo con los anteriores, o enlace al pedido en curso |

## Contrastes medidos (`src/tema/paleta.ts`)
| Par | Contraste | AA |
|---|---|---|
| Grafito sobre lima (botones) | 15,2:1 | Pasa |
| Texto suave sobre blanco | 6,3:1 | Pasa |
| Enlace lima profunda sobre blanco | 6,1:1 | Pasa |
| Texto suave sobre superficie (oscuro) | 6,9:1 | Pasa |
| Éxito sobre fondo de éxito | 4,6:1 | Pasa justo |
| Lima sobre blanco (si se usara como texto) | 1,3:1 | No pasa: nunca usar lima como texto en claro |
| Recorrido hecho sobre fondo claro | 2,4:1 | **No pasa** (3:1) |
| Borde de campos sobre blanco | 1,4:1 | **No pasa** (3:1) |

## Qué pasa al rediseño
- **Prioridad alta:** 1, 7, 8 y 11.
- **Para el card sorting:** 3, 5 y 14 son de arquitectura de información.
- **Cambios rápidos:** 4, 6, 13 y el orden de las acciones del 2.
