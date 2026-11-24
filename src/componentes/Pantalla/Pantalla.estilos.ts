import { StyleSheet } from 'react-native';

import { espacio, espacioBarraTabs, Tema } from '@/tema';

export const crearEstilos = ({ colores }: Tema) =>
  StyleSheet.create({
    fondo: { flex: 1, backgroundColor: colores.fondo },
    contenido: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      padding: espacio.l,
      paddingTop: espacio.xl,
      gap: espacio.xl,
    },
    conTabs: { paddingBottom: espacioBarraTabs },
    sinTabs: { paddingBottom: espacio.xxl },
    seccion: { gap: espacio.m },
    cabeceraSeccion: { gap: 2 },
    pie: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      paddingHorizontal: espacio.l,
      paddingTop: espacio.m,
      paddingBottom: espacio.xl,
      gap: espacio.s,
      backgroundColor: colores.fondo,
      borderTopWidth: 1,
      borderTopColor: colores.borde,
    },
  });
