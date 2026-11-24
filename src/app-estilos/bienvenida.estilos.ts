import { StyleSheet } from 'react-native';

import { espacio, fuentes, marca, Tema } from '@/tema';

// La bienvenida es siempre oscura: es la presentación de la marca.
export const crearEstilos = (_tema: Tema) =>
  StyleSheet.create({
    fondo: { flex: 1, backgroundColor: '#070807' },
    contenido: { flexGrow: 1, width: '100%', maxWidth: 520, alignSelf: 'center', padding: espacio.xl, gap: espacio.xl },
    arriba: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    saltar: { fontFamily: fuentes.media, fontSize: 15, color: '#9ba39d' },
    textos: { gap: espacio.m },
    etiqueta: { fontFamily: fuentes.media, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: marca.lima },
    titulo: { fontFamily: fuentes.negrita, fontSize: 30, lineHeight: 34, letterSpacing: -0.8, color: '#ffffff' },
    resaltado: { color: marca.lima },
    texto: { fontFamily: fuentes.regular, fontSize: 16, lineHeight: 23, color: '#c4cbc6' },
    puntos: { gap: espacio.s, marginTop: espacio.xs },
    punto: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
    vineta: { width: 8, height: 8, borderRadius: 4, backgroundColor: marca.lima },
    textoPunto: { flex: 1, fontFamily: fuentes.media, fontSize: 14, lineHeight: 20, color: '#eef2ea' },
    abajo: { marginTop: 'auto', gap: espacio.m },
    atras: { alignSelf: 'center', padding: espacio.s },
    indicador: { flexDirection: 'row', gap: 6, alignSelf: 'center', marginBottom: espacio.s },
    marca: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3a403c' },
    marcaActiva: { width: 28, backgroundColor: marca.lima },
  });
