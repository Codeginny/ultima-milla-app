import { StyleSheet } from 'react-native';

import { radio, Tema } from '@/tema';

export const crearEstilos = ({ colores }: Tema) =>
  StyleSheet.create({
    barra: { height: 12, borderRadius: radio.pildora, backgroundColor: colores.superficieTenue, flexDirection: 'row', overflow: 'hidden' },
    tramo: { height: '100%' },
    entregadas: { backgroundColor: colores.exito },
    noEntregadas: { backgroundColor: colores.error },
  });
