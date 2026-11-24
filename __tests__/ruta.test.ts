import { armarRuta, jornadaDemo, MINUTOS_EN_CALLE } from '@/datos/distribuidora';
import type { Entregas } from '@/tipos';
import {
  correspondeAviso,
  estimarRuta,
  faltaTexto,
  filtrarParadas,
  MINUTOS_POR_ENTREGA,
  paradaActual,
  paradasAntes,
  posicionCamion,
  progreso,
  resumenJornada,
  duracionTexto,
} from '@/utils/ruta';

const ahora = new Date('2026-11-20T12:00:00Z');
const { salida, entregas } = jornadaDemo(ahora);
const ruta = armarRuta(new Date(salida));
const minutos = (m: number) => m * 60_000;

describe('jornada de demostración', () => {
  it('arranca con el camión en la calle y dos entregas hechas', () => {
    expect(new Date(salida).getTime()).toBe(ahora.getTime() - minutos(MINUTOS_EN_CALLE));
    expect(progreso(ruta, entregas)).toEqual({ total: 7, entregadas: 2, noEntregadas: 0, pendientes: 5 });
    expect(paradaActual(ruta, entregas)?.id).toBe('p-03');
  });

  it('numera las paradas en orden y cada tramo termina en su parada', () => {
    ruta.paradas.forEach((p, i) => {
      expect(p.orden).toBe(i + 1);
      expect(p.tramo[p.tramo.length - 1]).toEqual(p.coordenadas);
    });
  });
});

describe('estimarRuta', () => {
  it('suma viaje y tiempo de entrega desde la última parada resuelta', () => {
    const estimadas = estimarRuta(ruta, entregas, ahora);
    const salidaDeLa2 = new Date(entregas['p-02'].hora).getTime();
    expect(estimadas[2].llegada.getTime()).toBe(salidaDeLa2 + minutos(ruta.paradas[2].minutosDeViaje));
    expect(estimadas[3].llegada.getTime()).toBe(estimadas[2].llegada.getTime() + minutos(MINUTOS_POR_ENTREGA + ruta.paradas[3].minutosDeViaje));
  });

  it('si el camión viene atrasado, la próxima llegada nunca queda en el pasado', () => {
    const tarde = new Date(ahora.getTime() + minutos(60));
    const estimadas = estimarRuta(ruta, entregas, tarde);
    expect(estimadas[2].llegada.getTime()).toBe(tarde.getTime());
    expect(estimadas[3].llegada.getTime()).toBeGreaterThan(tarde.getTime());
  });

  it('las paradas resueltas toman la hora en que las marcó el chofer', () => {
    const conFalla: Entregas = { ...entregas, 'p-03': { estado: 'no-entregada', hora: ahora.toISOString(), motivo: 'cerrado' } };
    const estimadas = estimarRuta(ruta, conFalla, ahora);
    expect(estimadas[2]).toMatchObject({ estado: 'no-entregada', llegada: ahora });
    expect(paradasAntes(ruta, conFalla, 'p-05')).toBe(1);
  });
});

describe('aviso 10 minutos antes', () => {
  const llegada = new Date(ahora.getTime() + minutos(10));
  it('corresponde con 10 minutos o menos y el pedido pendiente', () => {
    expect(correspondeAviso(llegada, ahora, 'pendiente')).toBe(true);
    expect(correspondeAviso(new Date(ahora.getTime() + minutos(11)), ahora, 'pendiente')).toBe(false);
    expect(correspondeAviso(llegada, ahora, 'entregada')).toBe(false);
  });
});

describe('posicionCamion', () => {
  it('queda sobre el tramo hacia la próxima parada', () => {
    const camion = posicionCamion(ruta, entregas, ahora);
    const tramo = ruta.paradas[2].tramo;
    const lats = tramo.map((c) => c.latitud);
    const lons = tramo.map((c) => c.longitud);
    expect(camion.latitud).toBeGreaterThanOrEqual(Math.min(...lats));
    expect(camion.latitud).toBeLessThanOrEqual(Math.max(...lats));
    expect(camion.longitud).toBeGreaterThanOrEqual(Math.min(...lons));
    expect(camion.longitud).toBeLessThanOrEqual(Math.max(...lons));
  });

  it('con todo resuelto, queda en la última parada', () => {
    const todas: Entregas = Object.fromEntries(ruta.paradas.map((p) => [p.id, { estado: 'entregada', hora: ahora.toISOString() }]));
    expect(posicionCamion(ruta, todas, ahora)).toEqual(ruta.paradas[ruta.paradas.length - 1].coordenadas);
  });
});

describe('textos y búsqueda', () => {
  it('formatea lo que falta', () => {
    expect(faltaTexto(0)).toBe('ahora');
    expect(faltaTexto(8)).toBe('en 8 min');
    expect(faltaTexto(70)).toBe('en 1 h 10 min');
    expect(faltaTexto(120)).toBe('en 2 h');
  });

  it('busca sin importar tildes ni mayúsculas', () => {
    expect(filtrarParadas(ruta.paradas, 'san agustin').map((p) => p.id)).toEqual(['p-05']);
    expect(filtrarParadas(ruta.paradas, 'BD-4103').map((p) => p.id)).toEqual(['p-03']);
    expect(filtrarParadas(ruta.paradas, '  ')).toHaveLength(7);
  });
});

describe('resumen del día', () => {
  it('cuenta entregas a tiempo, kilómetros y tiempo en la calle', () => {
    const r = resumenJornada(ruta, entregas, ahora);
    expect(r.entregadas).toBe(2);
    expect(r.aTiempo).toBe(2);
    expect(r.puntualidad).toBe(100);
    expect(r.kilometros).toBeGreaterThan(0);
    expect(r.minutosEnCalle).toBe(MINUTOS_EN_CALLE);
  });

  it('sin entregas todavía, la puntualidad queda sin dato', () => {
    expect(resumenJornada(ruta, {}, ahora).puntualidad).toBeNull();
  });

  it('formatea la duración', () => {
    expect(duracionTexto(40)).toBe('40 min');
    expect(duracionTexto(65)).toBe('1 h 05 min');
  });
});
