import { View } from 'react-native';

import { crearEstilos } from '@/componentes/Progreso/Progreso.estilos';
import { useEstilos } from '@/tema';

type Props = { entregadas: number; noEntregadas: number; total: number };

// Barra de avance de la ruta: verde lo entregado, rojo lo que no se pudo, el resto pendiente.
export function Progreso({ entregadas, noEntregadas, total }: Props) {
  const e = useEstilos(crearEstilos);
  const ancho = (n: number) => `${total ? (n / total) * 100 : 0}%` as const;
  return (
    <View
      style={e.barra}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: entregadas + noEntregadas }}>
      <View style={[e.tramo, e.entregadas, { width: ancho(entregadas) }]} />
      <View style={[e.tramo, e.noEntregadas, { width: ancho(noEntregadas) }]} />
    </View>
  );
}
