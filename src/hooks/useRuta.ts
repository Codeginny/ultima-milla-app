import { useCallback } from 'react';

import { useAhora } from '@/hooks/useAhora';
import { useCarga } from '@/hooks/useCarga';
import { useJornada } from '@/hooks/useJornada';
import { obtenerRuta } from '@/servicios/rutas';
import { estimarRuta, posicionCamion } from '@/utils/ruta';

// Ruta del día con sus estimaciones al minuto: la usan tanto el chofer como el cliente.
export function useRuta() {
  const jornada = useJornada();
  const ahora = useAhora(15_000);
  const carga = useCarga(useCallback(() => obtenerRuta(jornada.salida), [jornada.salida]));
  const ruta = carga.datos;
  return {
    ...carga,
    jornada,
    ahora,
    estimadas: ruta ? estimarRuta(ruta, jornada.entregas, ahora) : [],
    camion: ruta ? posicionCamion(ruta, jornada.entregas, ahora) : null,
  };
}
