import type { Coordenadas, Entregas, Parada, PedidoAnterior, Ruta, Usuario } from '@/tipos';
import { caminoEnEscuadra } from '@/utils/geo';

/**
 * Datos de ejemplo. "Distribuidora Bandada" es una empresa ficticia: los clientes, teléfonos,
 * direcciones y pedidos están inventados. Las coordenadas caen en Paraná (Entre Ríos) solo para que
 * el mapa muestre calles reales.
 */
export const EMPRESA = 'Distribuidora Bandada';

export const CONTRASENA_DEMO = 'demo1234';

export const usuariosDemo: Usuario[] = [
  { id: 'u-chofer', nombre: 'Lautaro Benítez', correo: 'chofer@demo.com', rol: 'chofer' },
  { id: 'u-cliente', nombre: 'Marta (Despensa Los Aromos)', correo: 'cliente@demo.com', rol: 'cliente', clienteId: 'c-05' },
];

const deposito = {
  nombre: 'Depósito central',
  direccion: 'Av. de las Américas 3200',
  coordenadas: { latitud: -31.7452, longitud: -60.5128 },
};

type ParadaBase = Omit<Parada, 'orden' | 'tramo' | 'ventana'>;

const paradasBase: ParadaBase[] = [
  {
    id: 'p-01',
    cliente: { id: 'c-01', nombre: 'Almacén Don Tito', contacto: 'Héctor', telefono: '+54 343 400-0101' },
    direccion: 'Gualeguaychú 1250',
    barrio: 'Barrio Sur',
    coordenadas: { latitud: -31.7405, longitud: -60.5186 },
    pedido: { codigo: 'BD-4101', bultos: 6, items: [{ producto: 'Yerba 1 kg', cantidad: 12 }, { producto: 'Azúcar 1 kg', cantidad: 10 }] },
    notas: 'Descargar por el portón lateral.',
    minutosDeViaje: 9,
  },
  {
    id: 'p-02',
    cliente: { id: 'c-02', nombre: 'Kiosco La Esquina Azul', contacto: 'Sofía', telefono: '+54 343 400-0102' },
    direccion: 'Laprida 480',
    barrio: 'Centro',
    coordenadas: { latitud: -31.7356, longitud: -60.5232 },
    pedido: { codigo: 'BD-4102', bultos: 3, items: [{ producto: 'Gaseosas 2,25 L', cantidad: 18 }, { producto: 'Alfajores (caja)', cantidad: 4 }] },
    notas: null,
    minutosDeViaje: 7,
  },
  {
    id: 'p-03',
    cliente: { id: 'c-03', nombre: 'Autoservicio El Puerto', contacto: 'Ramiro', telefono: '+54 343 400-0103' },
    direccion: 'Bv. Racedo 960',
    barrio: 'Bajada Grande',
    coordenadas: { latitud: -31.7309, longitud: -60.5291 },
    pedido: {
      codigo: 'BD-4103',
      bultos: 11,
      items: [
        { producto: 'Aceite 1,5 L', cantidad: 24 },
        { producto: 'Fideos 500 g', cantidad: 40 },
        { producto: 'Arroz 1 kg', cantidad: 20 },
      ],
    },
    notas: 'Recibe Ramiro; pide remito firmado.',
    minutosDeViaje: 10,
  },
  {
    id: 'p-04',
    cliente: { id: 'c-04', nombre: 'Panadería La Espiga', contacto: 'Graciela', telefono: '+54 343 400-0104' },
    direccion: 'Santa Fe 1720',
    barrio: 'Parque',
    coordenadas: { latitud: -31.7272, longitud: -60.5336 },
    pedido: { codigo: 'BD-4104', bultos: 8, items: [{ producto: 'Harina 000 (bolsa 25 kg)', cantidad: 4 }, { producto: 'Levadura (caja)', cantidad: 2 }] },
    notas: 'Entrar por calle de atrás, la vereda está en obra.',
    minutosDeViaje: 9,
  },
  {
    id: 'p-05',
    cliente: { id: 'c-05', nombre: 'Despensa Los Aromos', contacto: 'Marta', telefono: '+54 343 400-0105' },
    direccion: 'Los Aromos 215',
    barrio: 'San Agustín',
    coordenadas: { latitud: -31.7334, longitud: -60.5384 },
    pedido: {
      codigo: 'BD-4105',
      bultos: 5,
      items: [
        { producto: 'Leche larga vida 1 L', cantidad: 24 },
        { producto: 'Galletitas surtidas', cantidad: 15 },
        { producto: 'Lavandina 2 L', cantidad: 6 },
      ],
    },
    notas: null,
    minutosDeViaje: 8,
  },
  {
    id: 'p-06',
    cliente: { id: 'c-06', nombre: 'Bar del Parque', contacto: 'Nicolás', telefono: '+54 343 400-0106' },
    direccion: 'Rivadavia 2050',
    barrio: 'Parque',
    coordenadas: { latitud: -31.7388, longitud: -60.5343 },
    pedido: { codigo: 'BD-4106', bultos: 7, items: [{ producto: 'Agua mineral 500 ml', cantidad: 48 }, { producto: 'Café en grano 1 kg', cantidad: 3 }] },
    notas: 'Abre a las 11; antes tocar timbre del depósito.',
    minutosDeViaje: 8,
  },
  {
    id: 'p-07',
    cliente: { id: 'c-07', nombre: 'Minimercado San Martín', contacto: 'Julio', telefono: '+54 343 400-0107' },
    direccion: 'San Martín 2890',
    barrio: 'Barrio Sur',
    coordenadas: { latitud: -31.7424, longitud: -60.5268 },
    pedido: { codigo: 'BD-4107', bultos: 9, items: [{ producto: 'Detergente 750 ml', cantidad: 24 }, { producto: 'Papel higiénico x4', cantidad: 20 }] },
    notas: null,
    minutosDeViaje: 9,
  },
];

const MINUTO_MS = 60_000;
const MINUTOS_ATENCION = 6;
const dosCifras = (n: number) => String(n).padStart(2, '0');

// Redondea a media hora hacia abajo (desde) o hacia arriba (hasta) para armar la franja de recepción.
function aMediaHora(fecha: Date, haciaArriba: boolean): string {
  const minutos = fecha.getHours() * 60 + fecha.getMinutes();
  const redondo = haciaArriba ? Math.ceil(minutos / 30) * 30 : Math.floor(minutos / 30) * 30;
  const acotado = Math.min(Math.max(redondo, 0), 23 * 60 + 59);
  return `${dosCifras(Math.floor(acotado / 60))}:${dosCifras(acotado % 60)}`;
}

/**
 * Arma la ruta del día a partir de la hora de salida del depósito. Las franjas de cada cliente se
 * calculan alrededor del horario planificado, así la demo tiene sentido a cualquier hora.
 */
export function armarRuta(salida: Date): Ruta {
  let anterior: Coordenadas = deposito.coordenadas;
  let reloj = salida.getTime();
  const paradas = paradasBase.map((base, i): Parada => {
    reloj += base.minutosDeViaje * MINUTO_MS;
    const llegada = new Date(reloj);
    reloj += MINUTOS_ATENCION * MINUTO_MS;
    const tramo = caminoEnEscuadra(anterior, base.coordenadas);
    anterior = base.coordenadas;
    return {
      ...base,
      orden: i + 1,
      tramo,
      ventana: {
        desde: aMediaHora(new Date(llegada.getTime() - 45 * MINUTO_MS), false),
        hasta: aMediaHora(new Date(llegada.getTime() + 45 * MINUTO_MS), true),
      },
    };
  });
  return {
    id: 'r-hoy',
    empresa: EMPRESA,
    chofer: 'Lautaro Benítez',
    vehiculo: vehiculoDemo,
    deposito,
    salida: salida.toISOString(),
    paradas,
  };
}

// La demo arranca con el camión en la calle: salió hace 32 minutos y ya hizo las dos primeras entregas.
export const MINUTOS_EN_CALLE = 32;

export function jornadaDemo(ahora: Date): { salida: string; entregas: Entregas } {
  const salida = new Date(ahora.getTime() - MINUTOS_EN_CALLE * MINUTO_MS);
  const enMinuto = (m: number) => new Date(salida.getTime() + m * MINUTO_MS).toISOString();
  return {
    salida: salida.toISOString(),
    entregas: {
      'p-01': { estado: 'entregada', hora: enMinuto(14), receptor: 'Héctor', firmada: true },
      'p-02': { estado: 'entregada', hora: enMinuto(27), receptor: 'Sofía', firmada: true },
    },
  };
}

// Pedidos anteriores de la Despensa Los Aromos (cliente de prueba), para el historial.
export const pedidosAnteriores: PedidoAnterior[] = [
  {
    codigo: 'BD-3988',
    fecha: '2026-11-13',
    bultos: 6,
    items: [{ producto: 'Leche larga vida 1 L', cantidad: 24 }, { producto: 'Yerba 1 kg', cantidad: 10 }],
    receptor: 'Marta',
    horaEntrega: '11:42',
    chofer: 'Lautaro Benítez',
  },
  {
    codigo: 'BD-3871',
    fecha: '2026-11-06',
    bultos: 4,
    items: [{ producto: 'Galletitas surtidas', cantidad: 20 }, { producto: 'Lavandina 2 L', cantidad: 8 }],
    receptor: 'Joaquín (sobrino)',
    horaEntrega: '12:05',
    chofer: 'Lautaro Benítez',
  },
  {
    codigo: 'BD-3760',
    fecha: '2026-10-30',
    bultos: 7,
    items: [
      { producto: 'Aceite 1,5 L', cantidad: 12 },
      { producto: 'Fideos 500 g', cantidad: 30 },
      { producto: 'Arroz 1 kg', cantidad: 15 },
    ],
    receptor: 'Marta',
    horaEntrega: '10:58',
    chofer: 'Daniela Ruiz',
  },
];

export const vehiculoDemo = { modelo: 'Utilitario Fiorino', patente: 'AB 123 CD' };
