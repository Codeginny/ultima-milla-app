import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Linking, View } from 'react-native';

import { Boton } from '@/componentes/Boton/Boton';
import { GrupoBotones } from '@/componentes/Boton/GrupoBotones';
import { Dialogo } from '@/componentes/Dialogo/Dialogo';
import { EsqueletoLista } from '@/componentes/Esqueleto/Esqueleto';
import { EstadoVacio, ErrorReintentar } from '@/componentes/Estados/Estados';
import { Icono } from '@/componentes/Icono/Icono';
import { MapaRuta } from '@/componentes/MapaRuta/MapaRuta';
import { Notificacion } from '@/componentes/Notificacion/Notificacion';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { Texto } from '@/componentes/Texto/Texto';
import { useHaptica } from '@/hooks/useHaptica';
import { useRuta } from '@/hooks/useRuta';
import { compartir, mensajeAlCliente } from '@/servicios/compartir';
import { MotivoNoEntrega } from '@/tipos';
import { motivos, textoMotivo } from '@/utils/motivos';
import { dentroDeVentana, faltaTexto, horaCorta, minutosHasta, paradasAntes } from '@/utils/ruta';

// Detalle de una entrega: quién recibe, qué lleva y los botones para resolverla.
export default function DetalleParada() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { datos: ruta, error, cargando, recargar, estimadas, camion, ahora, jornada } = useRuta();
  const haptica = useHaptica();
  const [preguntarMotivo, setPreguntarMotivo] = useState(false);

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

  const noEntregar = (motivo: MotivoNoEntrega) => {
    jornada.marcarNoEntregada(parada.id, motivo);
    setPreguntarMotivo(false);
    haptica.error();
    router.back();
  };

  const comoLlegar = () => {
    const { latitud, longitud } = parada.coordenadas;
    Linking.openURL(`https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}#map=18/${latitud}/${longitud}`);
  };

  return (
    <Pantalla>
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

      <GrupoBotones>
        {estado === 'pendiente' ? (
          <>
            <Boton variante="acento" texto="Entregar y firmar" icono="create-outline" onPress={entregar} />
            <Boton texto="No se pudo entregar" variante="peligro" icono="close-circle-outline" onPress={() => setPreguntarMotivo(true)} />
            <Boton
              texto="Avisar al cliente"
              variante="secundario"
              icono="share-social-outline"
              onPress={() => compartir(mensajeAlCliente(parada.cliente.contacto, ruta.chofer, faltan))}
            />
            <Boton texto="Cómo llegar" variante="texto" icono="navigate-outline" onPress={comoLlegar} />
          </>
        ) : (
          <Boton texto="Deshacer y dejar pendiente" variante="texto" icono="arrow-undo-outline" onPress={() => jornada.deshacer(parada.id)} />
        )}
      </GrupoBotones>

      <Dialogo
        visible={preguntarMotivo}
        titulo="¿Qué pasó?"
        mensaje="El cliente va a ver el motivo en el seguimiento de su pedido."
        icono="alert"
        onCerrar={() => setPreguntarMotivo(false)}
        acciones={[
          ...motivos.map((m) => ({ texto: m.texto, variante: 'secundario' as const, onPress: () => noEntregar(m.valor) })),
          { texto: 'Cancelar', variante: 'texto' as const, onPress: () => setPreguntarMotivo(false) },
        ]}
      />
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
