import { Pressable, Text, View } from 'react-native';

import { crearEstilos } from '@/componentes/FilaParada/FilaParada.estilos';
import { Icono } from '@/componentes/Icono/Icono';
import { Texto } from '@/componentes/Texto/Texto';
import { useEstilos } from '@/tema';
import type { EstadoEntrega, Parada } from '@/tipos';
import { faltaTexto, horaCorta, minutosHasta } from '@/utils/ruta';

type Props = {
  parada: Parada;
  estado: EstadoEntrega;
  llegada: Date;
  ahora: Date;
  esSiguiente: boolean;
  onPress: () => void;
};

const textoEstado: Record<EstadoEntrega, string> = {
  pendiente: 'Pendiente',
  entregada: 'Entregada',
  'no-entregada': 'No entregada',
};

// Una parada de la ruta: número de orden, cliente, dirección y hora estimada o resultado.
export function FilaParada({ parada, estado, llegada, ahora, esSiguiente, onPress }: Props) {
  const e = useEstilos(crearEstilos);
  const resuelta = estado !== 'pendiente';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Parada ${parada.orden}, ${parada.cliente.nombre}, ${textoEstado[estado]}`}
      onPress={onPress}
      style={({ pressed }) => [e.fila, esSiguiente && e.siguiente, pressed && e.presionada]}>
      <View style={[e.orden, esSiguiente && e.ordenSiguiente, estado === 'entregada' && e.ordenEntregada, estado === 'no-entregada' && e.ordenFallida]}>
        {resuelta ? (
          <Icono nombre={estado === 'entregada' ? 'checkmark' : 'close'} tamano={18} color="sobrePrimario" />
        ) : (
          <Text style={[e.numero, esSiguiente && e.numeroSiguiente]}>{parada.orden}</Text>
        )}
      </View>
      <View style={e.textos}>
        {esSiguiente && <Texto variante="etiqueta" style={e.etiquetaSiguiente}>Próxima entrega</Texto>}
        <Texto variante="destacado" numberOfLines={1}>
          {parada.cliente.nombre}
        </Texto>
        <Texto variante="chico" numberOfLines={1}>
          {parada.direccion} · {parada.barrio}
        </Texto>
      </View>
      <View style={e.derecha}>
        <Texto variante="hora" style={resuelta && e.horaResuelta}>
          {horaCorta(llegada)}
        </Texto>
        <Texto variante="chico" tono={estado === 'entregada' ? 'exito' : estado === 'no-entregada' ? 'error' : undefined}>
          {resuelta ? textoEstado[estado] : faltaTexto(minutosHasta(llegada, ahora))}
        </Texto>
      </View>
    </Pressable>
  );
}
