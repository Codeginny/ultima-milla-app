import { StyleSheet } from 'react-native';

import { espacio, fuentes, radio, sombra, Tema } from '@/tema';

export const crearEstilos = (tema: Tema) => {
  const { colores } = tema;
  return StyleSheet.create({
    contenedor: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingHorizontal: espacio.l },
    pildora: {
      flexDirection: 'row',
      gap: espacio.xs,
      padding: 6,
      borderRadius: radio.pildora,
      backgroundColor: colores.barra,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      ...sombra(tema, 3),
    },
    pestana: {
      minWidth: 52,
      height: 52,
      borderRadius: radio.pildora,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: espacio.s,
      paddingHorizontal: espacio.l,
    },
    activa: { backgroundColor: colores.acento },
    texto: { fontFamily: fuentes.negrita, fontSize: 14, color: colores.sobreAcento },
  });
};
