import type { Coordenadas, Entregas, EstadoEntrega, Parada, Ruta } from '@/tipos';
import { largoMetros, puntoEnCamino } from '@/utils/geo';

// Lógica pura de la ruta del día: horarios estimados, parada actual, posición del camión y avisos.
export const MINUTOS_POR_ENTREGA = 6;
export const MINUTOS_AVISO = 10;
const MINUTO_MS = 60_000;

export type ParadaEstimada = {
  parada: Parada;
  estado: EstadoEntrega;
  // Llegada estimada (o la hora en que se resolvió, si ya se entregó o no se pudo).
  llegada: Date;
};

export function estadoDe(entregas: Entregas, paradaId: string): EstadoEntrega {
  return entregas[paradaId]?.estado ?? 'pendiente';
}

const sumarMinutos = (fecha: Date, minutos: number) => new Date(fecha.getTime() + minutos * MINUTO_MS);

/**
 * Recorre la ruta en orden. Las paradas resueltas toman la hora en que las marcó el chofer;
 * la primera pendiente nunca queda en el pasado (si el camión está atrasado, se corre todo lo que sigue).
 */
export function estimarRuta(ruta: Ruta, entregas: Entregas, ahora: Date): ParadaEstimada[] {
  let salidaAnterior = new Date(ruta.salida);
  let hayPendienteAntes = false;
  return ruta.paradas.map((parada) => {
    const entrega = entregas[parada.id];
    if (entrega) {
      salidaAnterior = new Date(entrega.hora);
      return { parada, estado: entrega.estado, llegada: salidaAnterior };
    }
    let llegada = sumarMinutos(salidaAnterior, parada.minutosDeViaje);
    if (!hayPendienteAntes && llegada < ahora) llegada = ahora;
    hayPendienteAntes = true;
    salidaAnterior = sumarMinutos(llegada, MINUTOS_POR_ENTREGA);
    return { parada, estado: 'pendiente', llegada };
  });
}

export function paradaActual(ruta: Ruta, entregas: Entregas): Parada | null {
  return ruta.paradas.find((p) => !entregas[p.id]) ?? null;
}

export function progreso(ruta: Ruta, entregas: Entregas) {
  const estados = ruta.paradas.map((p) => estadoDe(entregas, p.id));
  return {
    total: estados.length,
    entregadas: estados.filter((e) => e === 'entregada').length,
    noEntregadas: estados.filter((e) => e === 'no-entregada').length,
    pendientes: estados.filter((e) => e === 'pendiente').length,
  };
}

// Cuántas paradas pendientes hay antes que la de este cliente.
export function paradasAntes(ruta: Ruta, entregas: Entregas, paradaId: string): number {
  const indice = ruta.paradas.findIndex((p) => p.id === paradaId);
  return ruta.paradas.slice(0, indice).filter((p) => !entregas[p.id]).length;
}

/**
 * Posición simulada del camión: avanza por el tramo hacia la próxima parada pendiente según el
 * tiempo que pasó desde la última salida. Si terminó la ruta, queda en la última parada.
 */
export function posicionCamion(ruta: Ruta, entregas: Entregas, ahora: Date): Coordenadas {
  const siguiente = paradaActual(ruta, entregas);
  if (!siguiente) {
    const ultima = ruta.paradas[ruta.paradas.length - 1];
    return ultima ? ultima.coordenadas : ruta.deposito.coordenadas;
  }
  const indice = ruta.paradas.indexOf(siguiente);
  const anterior = ruta.paradas[indice - 1];
  const salida = anterior ? new Date(entregas[anterior.id].hora) : new Date(ruta.salida);
  const fraccion = (ahora.getTime() - salida.getTime()) / (siguiente.minutosDeViaje * MINUTO_MS);
  // Sin confirmación del chofer, el camión se queda en la puerta y no "llega" solo.
  return puntoEnCamino(siguiente.tramo, Math.min(fraccion, 0.97));
}

export function minutosHasta(fecha: Date, ahora: Date): number {
  return Math.max(0, Math.round((fecha.getTime() - ahora.getTime()) / MINUTO_MS));
}

// El aviso al cliente se dispara cuando faltan 10 minutos o menos y el pedido sigue pendiente.
export function correspondeAviso(llegada: Date, ahora: Date, estado: EstadoEntrega, minutosAntes = MINUTOS_AVISO): boolean {
  return estado === 'pendiente' && minutosHasta(llegada, ahora) <= minutosAntes;
}

const dosCifras = (n: number) => String(n).padStart(2, '0');

// "HH:MM" en la hora del teléfono.
export function horaCorta(fecha: Date): string {
  return `${dosCifras(fecha.getHours())}:${dosCifras(fecha.getMinutes())}`;
}

// "ahora", "en 1 min", "en 25 min", "en 1 h 10 min"
export function faltaTexto(minutos: number): string {
  if (minutos <= 0) return 'ahora';
  if (minutos < 60) return `en ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto ? `en ${horas} h ${resto} min` : `en ${horas} h`;
}

// ¿La llegada estimada cae dentro de la franja que pidió el cliente?
export function dentroDeVentana(llegada: Date, ventana: { desde: string; hasta: string }): boolean {
  const hora = horaCorta(llegada);
  return hora >= ventana.desde && hora <= ventana.hasta;
}

// Filtra paradas por cliente, dirección, barrio o código de pedido (sin importar tildes ni mayúsculas).
export function filtrarParadas(paradas: Parada[], texto: string): Parada[] {
  const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const buscado = normalizar(texto.trim());
  if (!buscado) return paradas;
  return paradas.filter((p) =>
    [p.cliente.nombre, p.direccion, p.barrio, p.pedido.codigo].some((campo) => normalizar(campo).includes(buscado)),
  );
}

/**
 * Números del día para el resumen del chofer: cuántas entregas, cuántas a tiempo (dentro de la
 * franja del cliente), kilómetros de los tramos ya hechos y minutos desde que salió del depósito.
 */
export function resumenJornada(ruta: Ruta, entregas: Entregas, ahora: Date) {
  const resueltas = ruta.paradas.filter((p) => entregas[p.id]);
  const entregadas = resueltas.filter((p) => entregas[p.id].estado === 'entregada');
  const aTiempo = entregadas.filter((p) => dentroDeVentana(new Date(entregas[p.id].hora), p.ventana)).length;
  const metros = resueltas.reduce((total, p) => total + largoMetros(p.tramo), 0);
  return {
    ...progreso(ruta, entregas),
    aTiempo,
    puntualidad: entregadas.length ? Math.round((aTiempo / entregadas.length) * 100) : null,
    kilometros: Math.round(metros / 100) / 10,
    minutosEnCalle: Math.max(0, Math.round((ahora.getTime() - new Date(ruta.salida).getTime()) / MINUTO_MS)),
  };
}

// "1 h 05 min", "40 min"
export function duracionTexto(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  return `${Math.floor(minutos / 60)} h ${String(minutos % 60).padStart(2, '0')} min`;
}
