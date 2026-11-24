import { armarRuta } from '@/datos/distribuidora';
import { responder } from '@/servicios/simulador';
import { Respuesta, Ruta } from '@/tipos';

// Ruta del día del chofer. Con API real sería GET /rutas/hoy.
export function obtenerRuta(salida: string): Promise<Respuesta<Ruta>> {
  return responder(armarRuta(new Date(salida)));
}
