import { StyleSheet } from 'react-native';

import { espacio, radio, sombra, Tema } from '@/tema';

export const crearEstilos = (tema: Tema) => {
  const { colores } = tema;
  return StyleSheet.create({
    tarjeta: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      gap: espacio.l,
      padding: espacio.l,
      borderRadius: radio.tarjeta,
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      ...sombra(tema, 1),
    },
    presionada: { transform: [{ scale: 0.99 }], borderColor: colores.acento },
    icono: { width: 52, height: 52, borderRadius: 18, backgroundColor: colores.acento, alignItems: 'center', justifyContent: 'center' },
    textos: { flex: 1, gap: 2 },
  });
};
