// Modelo de datos de la app. IDs string, fechas ISO 8601, horas "HH:MM".

export type Meta = {
  generadoEn: string;
  total: number | null;
};

export type ErrorApi = {
  codigo: string;
  mensaje: string;
};

export type Respuesta<T> = { datos: T; meta: Meta } | { error: ErrorApi };

export type Coordenadas = {
  latitud: number;
  longitud: number;
};

export type Rol = 'chofer' | 'cliente';

export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  // Solo para clientes: a qué parada de la ruta corresponde su pedido.
  clienteId?: string;
};

export type ItemPedido = {
  producto: string;
  cantidad: number;
};

export type Cliente = {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
};

export type Parada = {
  id: string;
  orden: number;
  cliente: Cliente;
  direccion: string;
  barrio: string;
  coordenadas: Coordenadas;
  // Franja en la que el cliente puede recibir.
  ventana: { desde: string; hasta: string };
  pedido: { codigo: string; bultos: number; items: ItemPedido[] };
  notas: string | null;
  // Minutos de manejo desde el punto anterior (depósito o parada previa).
  minutosDeViaje: number;
  // Camino por las calles desde el punto anterior hasta esta parada.
  tramo: Coordenadas[];
};

export type Ruta = {
  id: string;
  empresa: string;
  chofer: string;
  vehiculo: { modelo: string; patente: string };
  deposito: { nombre: string; direccion: string; coordenadas: Coordenadas };
  // Momento en que el camión salió del depósito (ISO).
  salida: string;
  paradas: Parada[];
};

export type EstadoEntrega = 'pendiente' | 'entregada' | 'no-entregada';

export type MotivoNoEntrega = 'ausente' | 'cerrado' | 'rechazado' | 'direccion';

export type Entrega = {
  estado: Exclude<EstadoEntrega, 'pendiente'>;
  // Cuándo la marcó el chofer (ISO).
  hora: string;
  motivo?: MotivoNoEntrega;
  // Comprobante de la entrega: quién la recibió y si firmó en el teléfono del chofer.
  receptor?: string;
  firmada?: boolean;
};

export type PedidoAnterior = {
  codigo: string;
  fecha: string;
  bultos: number;
  items: ItemPedido[];
  receptor: string;
  horaEntrega: string;
  chofer: string;
};

export type Entregas = Record<string, Entrega>;
