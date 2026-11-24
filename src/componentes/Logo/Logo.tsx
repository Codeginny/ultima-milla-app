import { Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { crearEstilos } from '@/componentes/Logo/Logo.estilos';
import { marca, useEstilos } from '@/tema';

type Props = {
  tamano?: 'chico' | 'portada';
  conPalabra?: boolean;
  // Sobre fondos que siempre son oscuros (portada, bienvenida) la palabra va en blanco.
  sobreOscuro?: boolean;
};

const lados = { chico: 30, portada: 72 } as const;

// Isotipo: un arco de ruta que termina en un punto, el último tramo hasta la puerta del cliente.
export function Isotipo({ lado }: { lado: number }) {
  return (
    <Svg width={lado} height={lado} viewBox="0 0 64 64">
      <Rect width={64} height={64} rx={18} fill={marca.grafito} />
      <Path d="M17 47V29a12 12 0 0 1 12-12h6a12 12 0 0 1 12 12v5" fill="none" stroke={marca.lima} strokeWidth={6.5} strokeLinecap="round" />
      <Circle cx={47} cy={45} r={5.5} fill={marca.lima} />
    </Svg>
  );
}

export function Logo({ tamano = 'chico', conPalabra, sobreOscuro }: Props) {
  const e = useEstilos(crearEstilos);
  return (
    <View style={[e.fila, tamano === 'portada' && e.filaPortada]} accessibilityRole="image" accessibilityLabel="Última Milla">
      <View style={tamano === 'portada' && e.halo}>
        <Isotipo lado={lados[tamano]} />
      </View>
      {conPalabra && <Text style={[e.palabra, tamano === 'portada' && e.palabraPortada, sobreOscuro && e.palabraClara]}>Última Milla</Text>}
    </View>
  );
}
