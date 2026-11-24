import { StyleSheet } from 'react-native';

import { fuentes, Tema } from '@/tema';

export const crearEstilos = ({ colores }: Tema) =>
  StyleSheet.create({
    fila: { flexDirection: 'row', marginTop: 4 },
    etapa: { flex: 1, alignItems: 'center', gap: 6 },
    marca: { alignSelf: 'stretch', height: 22, alignItems: 'center', justifyContent: 'center' },
    linea: { position: 'absolute', left: '-50%', right: '50%', top: 10, height: 3, backgroundColor: colores.superficieTenue },
    lineaHecha: { backgroundColor: colores.primario },
    punto: { width: 22, height: 22, borderRadius: 11, backgroundColor: colores.superficieTenue, alignItems: 'center', justifyContent: 'center' },
    puntoHecho: { backgroundColor: colores.primario },
    puntoActual: { backgroundColor: colores.acento },
    puntoFallido: { backgroundColor: colores.error },
    textoActual: { fontFamily: fuentes.seminegrita, color: colores.titulo },
  });
