import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { EstadoVacio } from '@/componentes/Estados/Estados';
import { Icono } from '@/componentes/Icono/Icono';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { Texto } from '@/componentes/Texto/Texto';
import { EMPRESA, pedidosAnteriores } from '@/datos/distribuidora';
import { useRuta } from '@/hooks/useRuta';
import { useTema } from '@/tema';
import { horaCorta } from '@/utils/ruta';

// Comprobante de un pedido entregado: quién lo recibió, cuándo, con firma, y qué se entregó.
export default function Comprobante() {
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const { datos: ruta, jornada } = useRuta();
  const { colores } = useTema();

  const deHoy = ruta?.paradas.find((p) => p.pedido.codigo === codigo);
  const entregaHoy = deHoy ? jornada.entregas[deHoy.id] : undefined;
  const anterior = pedidosAnteriores.find((p) => p.codigo === codigo);

  const datos = anterior
    ? { fecha: new Date(`${anterior.fecha}T12:00:00`), hora: anterior.horaEntrega, receptor: anterior.receptor, chofer: anterior.chofer, items: anterior.items, bultos: anterior.bultos }
    : deHoy && entregaHoy?.estado === 'entregada'
      ? { fecha: new Date(entregaHoy.hora), hora: horaCorta(new Date(entregaHoy.hora)), receptor: entregaHoy.receptor ?? 'Comercio', chofer: ruta?.chofer ?? '', items: deHoy.pedido.items, bultos: deHoy.pedido.bultos }
      : null;

  if (!datos) {
    return (
      <Pantalla>
        <EstadoVacio icono="receipt-outline" titulo="Todavía no hay comprobante" mensaje="El comprobante aparece cuando el chofer confirma la entrega." />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Tarjeta>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colores.acento, alignItems: 'center', justifyContent: 'center' }}>
            <Icono nombre="checkmark" tamano={24} color="sobreAcento" />
          </View>
          <View style={{ flex: 1 }}>
            <Texto variante="etiqueta">{EMPRESA}</Texto>
            <Texto variante="subtitulo">Pedido {codigo} entregado</Texto>
          </View>
        </View>
        <Fila etiqueta="Fecha" valor={datos.fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} />
        <Fila etiqueta="Hora" valor={datos.hora} />
        <Fila etiqueta="Recibió" valor={`${datos.receptor} · con firma`} />
        <Fila etiqueta="Chofer" valor={datos.chofer} />
        <Fila etiqueta="Bultos" valor={String(datos.bultos)} />
      </Tarjeta>

      <Seccion titulo="Qué se entregó">
        <Tarjeta>
          {datos.items.map((item) => (
            <Fila key={item.producto} etiqueta={item.producto} valor={`× ${item.cantidad}`} />
          ))}
        </Tarjeta>
      </Seccion>
    </Pantalla>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Texto tono="suave" style={{ flex: 1 }}>
        {etiqueta}
      </Texto>
      <Texto variante="destacado" style={{ textAlign: 'right', flexShrink: 1 }}>
        {valor}
      </Texto>
    </View>
  );
}
