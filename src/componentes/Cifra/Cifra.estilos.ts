import { StyleSheet } from 'react-native';

import { espacio, fuentes, radio, sombra, Tema } from '@/tema';

export const crearEstilos = (tema: Tema) => {
  const { colores } = tema;
  return StyleSheet.create({
    caja: {
      flexGrow: 1,
      flexBasis: '45%',
      minHeight: 112,
      padding: espacio.l,
      borderRadius: radio.tarjeta,
      backgroundColor: colores.superficie,
      justifyContent: 'space-between',
      gap: espacio.s,
      ...sombra(tema, 1),
    },
    destacada: { backgroundColor: colores.acento },
    etiqueta: { fontFamily: fuentes.media, fontSize: 13, color: colores.textoSuave },
    valor: { fontFamily: fuentes.negrita, fontSize: 34, lineHeight: 38, letterSpacing: -1, color: colores.titulo, fontVariant: ['tabular-nums'] },
    unidad: { fontFamily: fuentes.media, fontSize: 16, letterSpacing: 0, color: colores.textoSuave },
    sobreDestacada: { color: colores.sobreAcento },
  });
};
