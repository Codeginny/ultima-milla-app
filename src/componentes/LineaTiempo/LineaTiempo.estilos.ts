import { StyleSheet } from 'react-native';

import { espacio, Tema } from '@/tema';

export const crearEstilos = ({ colores }: Tema) =>
  StyleSheet.create({
    lista: { alignSelf: 'stretch' },
    fila: { flexDirection: 'row', alignItems: 'stretch', gap: espacio.m, minHeight: 64 },
    hora: { width: 44, paddingTop: 2, fontVariant: ['tabular-nums'] },
    eje: { width: 22, alignItems: 'center' },
    tramo: { position: 'absolute', width: 2, backgroundColor: colores.acento, left: 10 },
    tramoArriba: { top: 0, height: 4 },
    tramoAbajo: { top: 24, bottom: 0 },
    tramoPendiente: { backgroundColor: colores.borde },
    punto: { marginTop: 2, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    hecho: { backgroundColor: colores.acento },
    fallido: { backgroundColor: colores.error },
    pendiente: { borderWidth: 2, borderColor: colores.borde, backgroundColor: colores.fondo },
    textos: { flex: 1, gap: 2, paddingBottom: espacio.l },
  });
