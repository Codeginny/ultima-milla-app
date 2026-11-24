import { StyleSheet } from 'react-native';

import { espacio, fuentes, radio, tamanos, Tema } from '@/tema';

export const crearEstilos = ({ colores }: Tema) =>
  StyleSheet.create({
    contenedor: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      padding: 4,
      gap: 4,
      borderRadius: radio.pildora,
      backgroundColor: colores.superficieTenue,
    },
    opcion: { flex: 1, minHeight: 40, borderRadius: radio.pildora, alignItems: 'center', justifyContent: 'center', paddingHorizontal: espacio.s },
    activa: { backgroundColor: colores.primario },
    texto: { fontFamily: fuentes.media, fontSize: tamanos.chico, color: colores.sobreSecundario },
    textoActivo: { color: colores.sobrePrimario, fontFamily: fuentes.seminegrita },
  });
