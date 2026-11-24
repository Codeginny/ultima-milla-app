import { Text, View } from 'react-native';

import { crearEstilos } from '@/componentes/Cifra/Cifra.estilos';
import { useEstilos } from '@/tema';

type Props = { valor: string; unidad?: string; etiqueta: string; destacada?: boolean };

// Número grande con su unidad y una etiqueta corta; la destacada va en lima.
export function Cifra({ valor, unidad, etiqueta, destacada }: Props) {
  const e = useEstilos(crearEstilos);
  return (
    <View style={[e.caja, destacada && e.destacada]} accessibilityLabel={`${etiqueta}: ${valor} ${unidad ?? ''}`}>
      <Text style={[e.etiqueta, destacada && e.sobreDestacada]}>{etiqueta}</Text>
      <Text style={[e.valor, destacada && e.sobreDestacada]}>
        {valor}
        {!!unidad && <Text style={[e.unidad, destacada && e.sobreDestacada]}> {unidad}</Text>}
      </Text>
    </View>
  );
}
