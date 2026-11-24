import { StyleSheet } from 'react-native';

import { espacio, fuentes, radio, sombra, Tema } from '@/tema';

export const crearEstilos = (tema: Tema) => {
  const { colores } = tema;
  return StyleSheet.create({
    fila: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      gap: espacio.m,
      padding: espacio.l,
      borderRadius: radio.tarjeta,
      backgroundColor: colores.superficie,
      borderWidth: 2,
      borderColor: 'transparent',
      ...sombra(tema, 1),
    },
    siguiente: { borderColor: colores.acento },
    presionada: { opacity: 0.9 },
    orden: {
      width: 40,
      height: 40,
      borderRadius: radio.insignia,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colores.superficieTenue,
    },
    ordenSiguiente: { backgroundColor: colores.acento },
    ordenEntregada: { backgroundColor: colores.exito },
    ordenFallida: { backgroundColor: colores.error },
    numero: { fontFamily: fuentes.negrita, fontSize: 16, color: colores.titulo },
    numeroSiguiente: { color: colores.sobreAcento },
    textos: { flex: 1, minWidth: 0, gap: 2 },
    etiquetaSiguiente: { color: colores.acento },
    derecha: { alignItems: 'flex-end', gap: 2 },
    horaResuelta: { color: colores.textoSuave, fontSize: 18 },
  });
};
