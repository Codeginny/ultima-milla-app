import { Platform, StyleSheet } from 'react-native';

import { espacio, fuentes, marca, Tema } from '@/tema';

export const crearEstilos = ({ colores }: Tema) =>
  StyleSheet.create({
    fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
    filaPortada: { flexDirection: 'column', alignItems: 'flex-start', gap: espacio.l },
    // Resplandor lima alrededor del isotipo en la portada.
    halo: {
      borderRadius: 22,
      ...Platform.select({
        web: { boxShadow: `0px 0px 48px rgba(198, 244, 50, 0.35)` },
        default: { shadowColor: marca.lima, shadowOpacity: 0.5, shadowRadius: 24, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
      }),
    },
    palabra: { fontFamily: fuentes.negrita, fontSize: 18, letterSpacing: -0.3, color: colores.titulo },
    palabraPortada: { fontSize: 20 },
    palabraClara: { color: '#ffffff' },
  });
