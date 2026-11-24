import { aPixel, caminoEnEscuadra, distanciaMetros, limitesDe, puntoEnCamino, zoomParaEncuadrar } from '@/utils/geo';

describe('geo', () => {
  it('proyecta el origen al centro del mundo', () => {
    expect(aPixel({ latitud: 0, longitud: 0 }, 0)).toEqual({ x: 128, y: 128 });
  });

  it('mide distancias razonables (1 grado de latitud ≈ 111 km)', () => {
    const d = distanciaMetros({ latitud: 0, longitud: 0 }, { latitud: 1, longitud: 0 });
    expect(d).toBeGreaterThan(110_000);
    expect(d).toBeLessThan(112_000);
  });

  it('recorre un camino por fracción del largo', () => {
    const camino = caminoEnEscuadra({ latitud: 0, longitud: 0 }, { latitud: 0.01, longitud: 0.01 });
    expect(puntoEnCamino(camino, 0)).toEqual(camino[0]);
    expect(puntoEnCamino(camino, 1)).toEqual(camino[2]);
    expect(puntoEnCamino(camino, 2)).toEqual(camino[2]);
  });

  it('elige un zoom de ciudad para puntos cercanos y uno chico para puntos lejanos', () => {
    const ciudad = limitesDe([{ latitud: -31.74, longitud: -60.51 }, { latitud: -31.73, longitud: -60.54 }])!;
    const pais = limitesDe([{ latitud: -22, longitud: -65 }, { latitud: -55, longitud: -68 }])!;
    expect(zoomParaEncuadrar(ciudad, 360, 280)).toBeGreaterThanOrEqual(13);
    expect(zoomParaEncuadrar(pais, 360, 280)).toBeLessThan(6);
  });
});
