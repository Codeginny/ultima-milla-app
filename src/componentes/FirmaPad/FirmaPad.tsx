import { useState } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { crearEstilos } from '@/componentes/FirmaPad/FirmaPad.estilos';
import { useEstilos, useTema } from '@/tema';

type Props = { onCambiar: (firmada: boolean) => void };

// Recuadro para firmar con el dedo (o el mouse en la web). Solo informa si hay firma; el trazo no se guarda.
export function FirmaPad({ onCambiar }: Props) {
  const e = useEstilos(crearEstilos);
  const { colores } = useTema();
  const [trazos, setTrazos] = useState<string[]>([]);

  // Se crea una sola vez; los manejadores solo usan setState.
  const [responder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (ev) => {
        const { locationX: x, locationY: y } = ev.nativeEvent;
        setTrazos((t) => [...t, `M${x.toFixed(1)} ${y.toFixed(1)}`]);
      },
      onPanResponderMove: (ev) => {
        const { locationX: x, locationY: y } = ev.nativeEvent;
        // Cada movimiento alarga el último trazo.
        setTrazos((t) => [...t.slice(0, -1), `${t[t.length - 1] ?? ''} L${x.toFixed(1)} ${y.toFixed(1)}`]);
      },
      onPanResponderRelease: () => onCambiar(true),
    }),
  );

  const borrar = () => {
    setTrazos([]);
    onCambiar(false);
  };

  return (
    <View style={e.contenedor}>
      <View style={e.lienzo} {...responder.panHandlers} accessibilityLabel="Recuadro para firmar">
        <Svg width="100%" height="100%" pointerEvents="none">
          {trazos.map((d, i) => (
            <Path key={i} d={d} stroke={colores.titulo} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </Svg>
        {!trazos.length && (
          <Text style={e.ayuda} pointerEvents="none">
            Firmá acá con el dedo
          </Text>
        )}
        <View style={e.linea} pointerEvents="none" />
      </View>
      {trazos.length > 0 && (
        <Pressable accessibilityRole="button" onPress={borrar} style={e.borrar}>
          <Text style={e.textoBorrar}>Borrar firma</Text>
        </Pressable>
      )}
    </View>
  );
}
