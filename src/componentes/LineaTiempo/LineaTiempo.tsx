import { Pressable, View } from 'react-native';

import { Icono } from '@/componentes/Icono/Icono';
import { crearEstilos } from '@/componentes/LineaTiempo/LineaTiempo.estilos';
import { Texto } from '@/componentes/Texto/Texto';
import { useEstilos } from '@/tema';

export type Hito = { id: string; hora: string; titulo: string; detalle: string; tipo: 'hecho' | 'fallido' | 'pendiente'; onPress?: () => void };

// Línea vertical con la hora a la izquierda y un punto por hito: lima lo hecho, rojo lo fallido, hueco lo pendiente.
export function LineaTiempo({ hitos }: { hitos: Hito[] }) {
  const e = useEstilos(crearEstilos);
  return (
    <View style={e.lista}>
      {hitos.map((h, i) => (
        <Pressable key={h.id} disabled={!h.onPress} onPress={h.onPress} accessibilityRole={h.onPress ? 'button' : undefined} style={e.fila}>
          <Texto variante="chico" style={e.hora}>
            {h.hora}
          </Texto>
          <View style={e.eje}>
            {i > 0 && <View style={[e.tramo, e.tramoArriba, h.tipo === 'pendiente' && e.tramoPendiente]} />}
            <View style={[e.punto, e[h.tipo]]}>
              {h.tipo !== 'pendiente' && <Icono nombre={h.tipo === 'hecho' ? 'checkmark' : 'close'} tamano={12} color={h.tipo === 'hecho' ? 'sobreAcento' : 'sobreEncabezado'} />}
            </View>
            {i < hitos.length - 1 && <View style={[e.tramo, e.tramoAbajo, hitos[i + 1].tipo === 'pendiente' && e.tramoPendiente]} />}
          </View>
          <View style={e.textos}>
            <Texto variante="destacado">{h.titulo}</Texto>
            <Texto variante="chico">{h.detalle}</Texto>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
