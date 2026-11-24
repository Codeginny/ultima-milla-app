import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Logo } from '@/componentes/Logo/Logo';
import { crearEstilos } from '@/componentes/Navegacion/Portada.estilos';
import { marca, useEstilos } from '@/tema';

type Props = { titulo: string; resaltado: string; bajada: string };

// Cabecera oscura con un resplandor lima desde abajo, como una ruta encendida en el horizonte.
export function Portada({ titulo, resaltado, bajada }: Props) {
  const e = useEstilos(crearEstilos);
  return (
    <SafeAreaView edges={['top']} style={e.panel}>
      <Svg style={e.brillo} width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" pointerEvents="none">
        <Defs>
          <RadialGradient id="horizonte" cx="80" cy="120" r="85" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={marca.lima} stopOpacity={0.55} />
            <Stop offset="0.45" stopColor={marca.lima} stopOpacity={0.12} />
            <Stop offset="1" stopColor={marca.lima} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100" height="100" fill="url(#horizonte)" />
      </Svg>
      <View style={e.interior}>
        <Logo tamano="portada" conPalabra sobreOscuro />
        <Text style={e.titulo}>
          {titulo} <Text style={e.resaltado}>{resaltado}</Text>
        </Text>
        <Text style={e.bajada}>{bajada}</Text>
      </View>
    </SafeAreaView>
  );
}
