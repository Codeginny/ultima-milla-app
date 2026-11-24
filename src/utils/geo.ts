import type { Coordenadas } from '@/tipos';

// Cuentas de mapa sin dependencias: proyección Web Mercator (la de los mosaicos de OpenStreetMap) y distancias.
export const TAMANO_MOSAICO = 256;
const RADIO_TIERRA_M = 6_371_000;

const aRadianes = (grados: number) => (grados * Math.PI) / 180;

// Píxel "del mundo" de una coordenada para un zoom dado.
export function aPixel({ latitud, longitud }: Coordenadas, zoom: number): { x: number; y: number } {
  const escala = TAMANO_MOSAICO * 2 ** zoom;
  const seno = Math.sin(aRadianes(latitud));
  return {
    x: ((longitud + 180) / 360) * escala,
    y: (0.5 - Math.log((1 + seno) / (1 - seno)) / (4 * Math.PI)) * escala,
  };
}

export type Limites = { norte: number; sur: number; este: number; oeste: number };

export function limitesDe(puntos: Coordenadas[]): Limites | null {
  if (!puntos.length) return null;
  return {
    norte: Math.max(...puntos.map((p) => p.latitud)),
    sur: Math.min(...puntos.map((p) => p.latitud)),
    este: Math.max(...puntos.map((p) => p.longitud)),
    oeste: Math.min(...puntos.map((p) => p.longitud)),
  };
}

// Zoom (con decimales) en el que todos los puntos entran en el recuadro, dejando un margen.
export function zoomParaEncuadrar(limites: Limites, ancho: number, alto: number, margen = 40, zoomMaximo = 17): number {
  const a = aPixel({ latitud: limites.norte, longitud: limites.oeste }, 0);
  const b = aPixel({ latitud: limites.sur, longitud: limites.este }, 0);
  const escalaX = b.x - a.x > 0 ? (ancho - margen * 2) / (b.x - a.x) : Infinity;
  const escalaY = b.y - a.y > 0 ? (alto - margen * 2) / (b.y - a.y) : Infinity;
  const escala = Math.min(escalaX, escalaY);
  return Number.isFinite(escala) ? Math.min(zoomMaximo, Math.max(1, Math.log2(escala))) : zoomMaximo;
}

export function distanciaMetros(a: Coordenadas, b: Coordenadas): number {
  const dLat = aRadianes(b.latitud - a.latitud);
  const dLon = aRadianes(b.longitud - a.longitud);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aRadianes(a.latitud)) * Math.cos(aRadianes(b.latitud)) * Math.sin(dLon / 2) ** 2;
  return 2 * RADIO_TIERRA_M * Math.asin(Math.sqrt(h));
}

export function largoMetros(camino: Coordenadas[]): number {
  let total = 0;
  for (let i = 1; i < camino.length; i++) total += distanciaMetros(camino[i - 1], camino[i]);
  return total;
}

// Punto que está a una fracción (0 a 1) del largo de un camino.
export function puntoEnCamino(camino: Coordenadas[], fraccion: number): Coordenadas {
  if (camino.length === 1) return camino[0];
  const objetivo = largoMetros(camino) * Math.min(1, Math.max(0, fraccion));
  let recorrido = 0;
  for (let i = 1; i < camino.length; i++) {
    const tramo = distanciaMetros(camino[i - 1], camino[i]);
    if (recorrido + tramo >= objetivo) {
      const t = tramo === 0 ? 0 : (objetivo - recorrido) / tramo;
      return {
        latitud: camino[i - 1].latitud + (camino[i].latitud - camino[i - 1].latitud) * t,
        longitud: camino[i - 1].longitud + (camino[i].longitud - camino[i - 1].longitud) * t,
      };
    }
    recorrido += tramo;
  }
  return camino[camino.length - 1];
}

// Camino "en escuadra" entre dos esquinas, como se maneja en una ciudad cuadriculada.
export function caminoEnEscuadra(desde: Coordenadas, hasta: Coordenadas): Coordenadas[] {
  return [desde, { latitud: desde.latitud, longitud: hasta.longitud }, hasta];
}
