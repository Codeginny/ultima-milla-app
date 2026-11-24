import { Pressable, Text, View } from 'react-native';

import { crearEstilos } from '@/componentes/Segmentos/Segmentos.estilos';
import { useHaptica } from '@/hooks/useHaptica';
import { useEstilos } from '@/tema';

type Props<T extends string> = {
  opciones: { valor: T; texto: string }[];
  valor: T;
  onCambiar: (valor: T) => void;
};

// Control segmentado: una sola opción activa, como pestañas chicas dentro de una pantalla.
export function Segmentos<T extends string>({ opciones, valor, onCambiar }: Props<T>) {
  const e = useEstilos(crearEstilos);
  const haptica = useHaptica();
  return (
    <View style={e.contenedor} accessibilityRole="tablist">
      {opciones.map((o) => {
        const activa = o.valor === valor;
        return (
          <Pressable
            key={o.valor}
            accessibilityRole="tab"
            accessibilityState={{ selected: activa }}
            onPress={() => {
              haptica.toque();
              onCambiar(o.valor);
            }}
            style={[e.opcion, activa && e.activa]}>
            <Text style={[e.texto, activa && e.textoActivo]}>{o.texto}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
