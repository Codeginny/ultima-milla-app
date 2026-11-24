import type { Marcador, Trazo } from '@/componentes/MapaRuta/MapaRuta';
import type { ParadaEstimada } from '@/utils/ruta';
import type { Ruta } from '@/tipos';

// Arma marcadores y trazos de la ruta completa para el mapa del chofer.
export function capasDeRuta(ruta: Ruta, estimadas: ParadaEstimada[]): { marcadores: Marcador[]; trazos: Trazo[] } {
  const siguiente = estimadas.find((p) => p.estado === 'pendiente')?.parada.id;
  const marcadores: Marcador[] = [
    { id: 'deposito', coordenadas: ruta.deposito.coordenadas, etiqueta: 'D', tipo: 'deposito', nombre: ruta.deposito.nombre },
    ...estimadas.map(({ parada, estado }): Marcador => ({
      id: parada.id,
      coordenadas: parada.coordenadas,
      etiqueta: String(parada.orden),
      tipo: estado !== 'pendiente' ? estado : parada.id === siguiente ? 'siguiente' : 'pendiente',
      nombre: `Parada ${parada.orden}: ${parada.cliente.nombre}`,
    })),
  ];
  const trazos: Trazo[] = estimadas.map(({ parada, estado }) => ({ camino: parada.tramo, hecho: estado !== 'pendiente' }));
  return { marcadores, trazos };
}
