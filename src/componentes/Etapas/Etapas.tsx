import { View } from 'react-native';

import { crearEstilos } from '@/componentes/Etapas/Etapas.estilos';
import { Icono } from '@/componentes/Icono/Icono';
import { Texto } from '@/componentes/Texto/Texto';
import { useEstilos } from '@/tema';

const etapas = ['Preparado', 'En camino', 'Cerca', 'Entregado'];

// Línea de etapas del pedido. Si la entrega falló, la última etapa se marca en rojo.
export function Etapas({ actual, fallida }: { actual: number; fallida?: boolean }) {
  const e = useEstilos(crearEstilos);
  return (
    <View style={e.fila} accessibilityLabel={`Etapa: ${fallida ? 'no entregado' : etapas[actual]}`}>
      {etapas.map((nombre, i) => {
        const hecha = i <= actual;
        const ultimaFallida = fallida && i === etapas.length - 1;
        return (
          <View key={nombre} style={e.etapa}>
            <View style={e.marca}>
              {i > 0 && <View style={[e.linea, hecha && e.lineaHecha]} />}
              <View style={[e.punto, hecha && e.puntoHecho, i === actual && !fallida && e.puntoActual, ultimaFallida && e.puntoFallido]}>
                {hecha && <Icono nombre={ultimaFallida ? 'close' : 'checkmark'} tamano={12} color="sobrePrimario" />}
              </View>
            </View>
            <Texto variante="chico" centrado style={i === actual && e.textoActual}>
              {ultimaFallida ? 'No entregado' : nombre}
            </Texto>
          </View>
        );
      })}
    </View>
  );
}
