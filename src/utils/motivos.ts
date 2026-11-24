import type { MotivoNoEntrega } from '@/tipos';

// Motivos por los que una entrega puede quedar sin hacer; el cliente los ve en su seguimiento.
export const motivos: { valor: MotivoNoEntrega; texto: string }[] = [
  { valor: 'ausente', texto: 'No había nadie' },
  { valor: 'cerrado', texto: 'El local estaba cerrado' },
  { valor: 'rechazado', texto: 'El cliente rechazó el pedido' },
  { valor: 'direccion', texto: 'No encontré la dirección' },
];

export const textoMotivo = (motivo?: MotivoNoEntrega) => motivos.find((m) => m.valor === motivo)?.texto ?? 'Sin motivo';
