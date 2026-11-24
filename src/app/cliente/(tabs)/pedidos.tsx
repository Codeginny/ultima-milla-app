import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Icono } from '@/componentes/Icono/Icono';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { Texto } from '@/componentes/Texto/Texto';
import { pedidosAnteriores } from '@/datos/distribuidora';
import { useRuta } from '@/hooks/useRuta';
import { useSesion } from '@/hooks/useSesion';
import { useTema } from '@/tema';
import { faltaTexto, minutosHasta } from '@/utils/ruta';

const fechaLarga = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

// Historial del comercio: el pedido de hoy arriba y los anteriores con su comprobante.
export default function Pedidos() {
  const { usuario } = useSesion();
  const { estimadas, ahora, jornada } = useRuta();
  const { colores } = useTema();
  const hoy = estimadas.find((p) => p.parada.cliente.id === usuario?.clienteId);
  const entregaHoy = hoy ? jornada.entregas[hoy.parada.id] : undefined;

  return (
    <Pantalla conTabs>
      {hoy && (
        <Seccion titulo="Hoy">
          <Tarjeta
            enFila
            onPress={() =>
              entregaHoy?.estado === 'entregada'
                ? router.push({ pathname: '/cliente/pedido/[codigo]', params: { codigo: hoy.parada.pedido.codigo } })
                : router.navigate('/cliente')
            }
            etiquetaAccesible={`Pedido ${hoy.parada.pedido.codigo} de hoy`}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: colores.acento, alignItems: 'center', justifyContent: 'center' }}>
              <Icono nombre="cube" tamano={22} color="sobreAcento" />
            </View>
            <View style={{ flex: 1 }}>
              <Texto variante="destacado">Pedido {hoy.parada.pedido.codigo}</Texto>
              <Texto variante="chico">
                {hoy.estado === 'entregada'
                  ? `Entregado · recibió ${entregaHoy?.receptor ?? 'el comercio'}`
                  : hoy.estado === 'no-entregada'
                    ? 'No se pudo entregar'
                    : `En camino · llega ${faltaTexto(minutosHasta(hoy.llegada, ahora))}`}
              </Texto>
            </View>
            <Icono nombre="chevron-forward" tamano={20} color="textoSuave" />
          </Tarjeta>
        </Seccion>
      )}

      <Seccion titulo="Anteriores" descripcion="Tocá un pedido para ver el comprobante">
        {pedidosAnteriores.map((p) => (
          <Pressable
            key={p.codigo}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/cliente/pedido/[codigo]', params: { codigo: p.codigo } })}>
            <Tarjeta enFila>
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: colores.superficieTenue, alignItems: 'center', justifyContent: 'center' }}>
                <Icono nombre="checkmark-done" tamano={22} color="titulo" />
              </View>
              <View style={{ flex: 1 }}>
                <Texto variante="destacado">Pedido {p.codigo}</Texto>
                <Texto variante="chico">
                  {fechaLarga(p.fecha)} · {p.bultos} bultos
                </Texto>
              </View>
              <Texto variante="chico">{p.horaEntrega}</Texto>
            </Tarjeta>
          </Pressable>
        ))}
      </Seccion>
    </Pantalla>
  );
}
