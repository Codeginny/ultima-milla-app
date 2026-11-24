import { StyleSheet } from 'react-native';

import { espacio, fuentes, marca, radio, Tema } from '@/tema';

export const crearEstilos = (_tema: Tema) =>
  StyleSheet.create({
    // Siempre oscura, en los dos temas: es la "portada" de la marca.
    panel: {
      backgroundColor: marca.grafito,
      borderBottomLeftRadius: radio.portada,
      borderBottomRightRadius: radio.portada,
      overflow: 'hidden',
    },
    brillo: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
    interior: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      gap: espacio.l,
      paddingHorizontal: espacio.xl,
      paddingTop: espacio.xxl,
      paddingBottom: espacio.xxl + espacio.l,
    },
    titulo: { fontFamily: fuentes.negrita, fontSize: 34, lineHeight: 38, letterSpacing: -1, color: '#ffffff' },
    resaltado: { color: marca.lima },
    bajada: { fontFamily: fuentes.regular, fontSize: 16, lineHeight: 23, color: '#c4cbc6', maxWidth: 420 },
  });
