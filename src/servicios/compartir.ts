import { Share } from 'react-native';

import { EMPRESA } from '@/datos/distribuidora';
import { faltaTexto, horaCorta } from '@/utils/ruta';

// Textos listos para mandar por WhatsApp, SMS o mail desde la hoja de compartir del sistema.
export function mensajeSeguimiento(codigo: string, llegada: Date, faltan: number): string {
  return `Pedido ${codigo} de ${EMPRESA}: llega ${faltaTexto(faltan)} (aprox. ${horaCorta(llegada)}).`;
}

export function mensajeAlCliente(contacto: string, chofer: string, faltan: number): string {
  return `Hola ${contacto}, soy ${chofer} de ${EMPRESA}. Llego con tu pedido ${faltaTexto(faltan)}.`;
}

export async function compartir(mensaje: string): Promise<void> {
  try {
    await Share.share({ message: mensaje });
  } catch {
    // La persona cerró la hoja de compartir o el navegador no la soporta.
  }
}
