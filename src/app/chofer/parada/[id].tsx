import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ReactNode } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { Boton } from '@/componentes/Boton/Boton';
import { EsqueletoLista } from '@/componentes/Esqueleto/Esqueleto';
import { EstadoVacio, ErrorReintentar } from '@/componentes/Estados/Estados';
import { Icono, NombreIcono } from '@/componentes/Icono/Icono';
import { MapaRuta } from '@/componentes/MapaRuta/MapaRuta';
import { Notificacion } from '@/componentes/Notificacion/Notificacion';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { Texto } from '@/componentes/Texto/Texto';
import { useRuta } from '@/hooks/useRuta';
import { compartir, mensajeAlCliente } from '@/servicios/compartir';
import { comoLlegar } from '@/servicios/navegar';
import { useTema } from '@/tema';
import { textoMotivo } from '@/utils/motivos';
import { dentroDeVentana, faltaTexto, horaCorta, minutosHasta, paradasAntes } from '@/utils/ruta';

// Detalle de una entrega: las acciones en el orden del recorrido (llegar, avisar, llamar),
// quién recibe, qué lleva y, fijos abajo, los botones para resolverla.
export default function DetalleParada() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { datos: ruta, error, cargando, recargar, estimadas, camion, ahora, jornada } = useRuta();

  if (cargando || !ruta) {
    return <Pantalla>{error ? <ErrorReintentar error={error} onReintentar={recargar} /> : <EsqueletoLista variante="aviso" cantidad={2} />}</Pantalla>;
  }

  const estimada = estimadas.find((p) => p.parada.id === id);
  if (!estimada) {
    return (
      <Pantalla>
        <EstadoVacio icono="help-circle-outline" titulo="No encontramos esta parada" mensaje="Puede que ya no esté en la ruta de hoy." />
      </Pantalla>
    );
  }

  const { parada, estado, llegada } = estimada;
  const entrega = jornada.entregas[parada.id];
  const antes = paradasAntes(ruta, jornada.entregas, parada.id);
  const faltan = minutosHasta(llegada, ahora);
  const esSiguiente = estado === 'pendiente' && antes === 0;

  const entregar = () => router.push({ pathname: '/chofer/confirmar/[id]', params: { id: parada.id } });

  const pendiente = estado === 'pendiente';

  return (
    <Pantalla
      pie={
        pendiente ? (
          <>
            <Boton variante="acento" texto="Entregar y firmar" icono="create-outline" onPress={entregar} />
            <Boton texto="No se pudo entregar" variante="peligro" icono="close-circle-outline" onPress={() => router.push({ pathname: '/chofer/no-entregada/[id]', params: { id: parada.id } })} />
          </>
        ) : undefined
      }>
      <Stack.Screen options={{ title: `Parada ${parada.orden}` }} />

      {estado === 'entregada' && (
        <Notificacion
          tipo="exito"
          titulo="Entregada"
          mensaje={`A las ${horaCorta(new Date(entrega.hora))}${entrega.receptor ? `, recibió ${entrega.receptor}` : ''}${entrega.firmada ? ' (con firma)' : ''}.`}
        />
      )}
      {estado === 'no-entregada' && (
        <Notificacion tipo="error" titulo="No se pudo entregar" mensaje={`${textoMotivo(entrega.motivo)} · ${horaCorta(new Date(entrega.hora))}`} />
      )}

      <Seccion titulo={parada.cliente.nombre} descripcion={`${parada.direccion} · ${parada.barrio}`}>
        <MapaRuta
          marcadores={[{ id: parada.id, coordenadas: parada.coordenadas, etiqueta: String(parada.orden), tipo: 'destino', nombre: parada.cliente.nombre }]}
          trazos={[{ camino: parada.tramo, hecho: estado !== 'pendiente' }]}
          camion={esSiguiente ? camion : null}
          alto={220}
          etiqueta={`Mapa hasta ${parada.cliente.nombre}`}
        />
      </Seccion>

      {pendiente && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Accion icono="navigate-outline" texto="Cómo llegar" onPress={() => comoLlegar(parada.coordenadas)} />
          <Accion
            icono="share-social-outline"
            texto="Avisar"
            onPress={() => compartir(mensajeAlCliente(parada.cliente.contacto, ruta.chofer, faltan))}
          />
          <Accion icono="call-outline" texto="Llamar" onPress={() => Linking.openURL(`tel:${parada.cliente.telefono.replace(/\s/g, '')}`)} />
        </View>
      )}

      <Tarjeta>
        <Dato icono="time-outline" titulo={estado === 'pendiente' ? `Llegada estimada ${horaCorta(llegada)}` : 'Franja del cliente'}>
          {estado === 'pendiente' ? `${faltaTexto(faltan)} · ` : ''}recibe de {parada.ventana.desde} a {parada.ventana.hasta}
        </Dato>
        {estado === 'pendiente' && !dentroDeVentana(llegada, parada.ventana) && (
          <Texto variante="chico" tono="error">
            La llegada estimada queda fuera de la franja: conviene avisarle al cliente.
          </Texto>
        )}
        {estado === 'pendiente' && antes > 0 && (
          <Texto variante="chico">
            Antes hay {antes} {antes === 1 ? 'parada pendiente' : 'paradas pendientes'}.
          </Texto>
        )}
        <Dato icono="person-outline" titulo={parada.cliente.contacto}>
          {parada.cliente.telefono}
        </Dato>
      </Tarjeta>

      <Seccion titulo={`Pedido ${parada.pedido.codigo}`} descripcion={`${parada.pedido.bultos} bultos`}>
        <Tarjeta>
          {parada.pedido.items.map((item) => (
            <View key={item.producto} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <Texto style={{ flex: 1 }}>{item.producto}</Texto>
              <Texto variante="destacado">× {item.cantidad}</Texto>
            </View>
          ))}
        </Tarjeta>
        {!!parada.notas && <Notificacion tipo="info" titulo="Nota del cliente" mensaje={parada.notas} />}
      </Seccion>

      {!pendiente && (
        <Boton texto="Deshacer y dejar pendiente" variante="texto" icono="arrow-undo-outline" onPress={() => jornada.deshacer(parada.id)} />
      )}

    </Pantalla>
  );
}

function Dato({ icono, titulo, children }: { icono: 'time-outline' | 'person-outline'; titulo: string; children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <Icono nombre={icono} tamano={20} color="enlace" />
      <View style={{ flex: 1, gap: 2 }}>
        <Texto variante="destacado">{titulo}</Texto>
        <Texto variante="chico">{children}</Texto>
      </View>
    </View>
  );
}

// Acción rápida de la parada: botón cuadrado de 64 px, cómodo con guantes o con el celular en el soporte.
function Accion({ icono, texto, onPress }: { icono: NombreIcono; texto: string; onPress: () => void }) {
  const { colores } = useTema();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={texto}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 64,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colores.bordeControl,
        backgroundColor: colores.superficie,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        opacity: pressed ? 0.8 : 1,
      })}>
      <Icono nombre={icono} tamano={22} color="texto" />
      <Texto variante="destacado">{texto}</Texto>
    </Pressable>
  );
}
