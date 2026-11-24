import { StyleSheet } from 'react-native';

import { espacio, fuentes, radio, Tema } from '@/tema';

export const crearEstilos = ({ colores }: Tema) =>
  StyleSheet.create({
    contenedor: { alignSelf: 'stretch', gap: espacio.s },
    lienzo: {
      height: 170,
      borderRadius: radio.tarjeta,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colores.borde,
      backgroundColor: colores.superficie,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ayuda: { position: 'absolute', fontFamily: fuentes.media, fontSize: 15, color: colores.textoSuave },
    linea: { position: 'absolute', left: 24, right: 24, bottom: 36, height: 1, backgroundColor: colores.borde },
    borrar: { alignSelf: 'flex-end', padding: espacio.xs },
    textoBorrar: { fontFamily: fuentes.media, fontSize: 14, color: colores.enlace },
  });
