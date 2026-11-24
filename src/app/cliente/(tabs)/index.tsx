import { View } from 'react-native';

import { Boton } from '@/componentes/Boton/Boton';
import { GrupoBotones } from '@/componentes/Boton/GrupoBotones';
import { EsqueletoLista } from '@/componentes/Esqueleto/Esqueleto';
import { EstadoVacio, ErrorReintentar } from '@/componentes/Estados/Estados';
import { Etapas } from '@/componentes/Etapas/Etapas';
import { MapaRuta, Trazo } from '@/componentes/MapaRuta/MapaRuta';
import { Notificacion } from '@/componentes/Notificacion/Notificacion';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { Texto } from '@/componentes/Texto/Texto';
import { useAvisoLlegada } from '@/hooks/useAvisoLlegada';
import { useRuta } from '@/hooks/useRuta';
import { useSesion } from '@/hooks/useSesion';
import { compartir, mensajeSeguimiento } from '@/servicios/compartir';
import { textoMotivo } from '@/utils/motivos';
import { correspondeAviso, faltaTexto, horaCorta, MINUTOS_AVISO, minutosHasta, paradasAntes } from '@/utils/ruta';

const mensajesAviso = {
  'sin-permiso': 'Activá las notificaciones de la app en los ajustes del teléfono para recibir el aviso.',
  'muy-tarde': `Faltan ${MINUTOS_AVISO} minutos o menos: el pedido ya está por llegar.`,
  'solo-en-app': 'En la versión web el aviso aparece dentro de esta pantalla (dejala abierta).',
} as const;

// Seguimiento del cliente: dónde está el camión, cuándo llega su pedido y el aviso 10 minutos antes.
export default function MiPedido() {
  const { usuario } = useSesion();
  const { datos: ruta, error, cargando, recargar, estimadas, camion, ahora, jornada } = useRuta();
  const estimada = estimadas.find((p) => p.parada.cliente.id === usuario?.clienteId) ?? null;
  const aviso = useAvisoLlegada(estimada?.parada.pedido.codigo ?? '', estimada?.llegada ?? null, estimada?.estado === 'pendiente');


  if (cargando || !ruta) {
    return (
      <Pantalla conTabs>
        {error ? <ErrorReintentar error={error} onReintentar={recargar} /> : <EsqueletoLista variante="aviso" cantidad={2} />}
      </Pantalla>
    );
  }

  if (!estimada) {
    return (
      <Pantalla conTabs onRefrescar={recargar}>
        <EstadoVacio icono="cube-outline" titulo="Hoy no tenés pedidos en camino" mensaje="Cuando la distribuidora despache tu pedido, lo vas a ver acá." />
      </Pantalla>
    );
  }

  const { parada, estado, llegada } = estimada;
  const entrega = jornada.entregas[parada.id];
  const faltan = minutosHasta(llegada, ahora);
  const antes = paradasAntes(ruta, jornada.entregas, parada.id);
  const cerca = correspondeAviso(llegada, ahora, estado);
  const etapa = estado !== 'pendiente' ? 3 : cerca ? 2 : 1;

  // Del camión en adelante: los tramos que faltan hasta la puerta del cliente.
  const pendientes = ruta.paradas.slice(0, parada.orden).filter((p) => !jornada.entregas[p.id]);
  const trazos: Trazo[] = estado === 'pendiente' ? pendientes.map((p) => ({ camino: p.tramo, hecho: false })) : [];

  return (
    <Pantalla conTabs onRefrescar={recargar}>

      {cerca && <Notificacion tipo="aviso" titulo={`Tu pedido llega ${faltaTexto(faltan)}`} mensaje="Tené a mano a quien lo vaya a recibir." />}

      <Tarjeta>
        <Texto variante="etiqueta">
          Pedido {parada.pedido.codigo} · {ruta.empresa}
        </Texto>
        {estado === 'entregada' && <Texto variante="titulo">¡Pedido entregado!</Texto>}
        {estado === 'no-entregada' && <Texto variante="titulo">No pudimos entregarlo</Texto>}
        {estado === 'pendiente' && (
          <View>
            <Texto variante="titulo">Llega {faltaTexto(faltan)}</Texto>
            <Texto>
              Aproximadamente a las {horaCorta(llegada)}
              {antes > 0 ? ` · antes hay ${antes} ${antes === 1 ? 'entrega' : 'entregas'}` : ' · sos la próxima entrega'}
            </Texto>
          </View>
        )}
        {estado === 'entregada' && <Texto>Recibido a las {horaCorta(new Date(entrega.hora))}.</Texto>}
        {estado === 'no-entregada' && (
          <Texto>
            {textoMotivo(entrega.motivo)} ({horaCorta(new Date(entrega.hora))}). La distribuidora se va a comunicar para reprogramar.
          </Texto>
        )}
        <Etapas actual={etapa} fallida={estado === 'no-entregada'} />
      </Tarjeta>

      {estado === 'pendiente' && (
        <MapaRuta
          marcadores={[{ id: parada.id, coordenadas: parada.coordenadas, etiqueta: '', tipo: 'destino', nombre: 'Tu dirección' }]}
          trazos={trazos}
          camion={camion}
          etiqueta="Mapa con el camión y tu dirección"
        />
      )}

      {estado === 'pendiente' && (
        <Seccion titulo={`Aviso ${MINUTOS_AVISO} minutos antes`} descripcion="Te mandamos una notificación cuando el camión esté cerca.">
          {aviso.resultado && aviso.resultado !== 'programado' && (
            <Notificacion tipo={aviso.resultado === 'sin-permiso' ? 'error' : 'info'} titulo="Sobre el aviso" mensaje={mensajesAviso[aviso.resultado]} />
          )}
          {aviso.activo ? (
            <>
              <Notificacion tipo="exito" titulo="Aviso activado" mensaje={`Suena cerca de las ${horaCorta(new Date(llegada.getTime() - MINUTOS_AVISO * 60_000))}; si el camión se demora, se corre solo.`} />
              <Boton texto="Quitar el aviso" variante="texto" icono="notifications-off-outline" onPress={aviso.desactivar} />
            </>
          ) : (
            <Boton texto={`Avisarme ${MINUTOS_AVISO} minutos antes`} icono="notifications-outline" cargando={aviso.programando} onPress={aviso.activar} />
          )}
        </Seccion>
      )}

      <Seccion titulo="Tu pedido" descripcion={`${parada.pedido.bultos} bultos · ${parada.direccion}`}>
        <Tarjeta>
          {parada.pedido.items.map((item) => (
            <View key={item.producto} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <Texto style={{ flex: 1 }}>{item.producto}</Texto>
              <Texto variante="destacado">× {item.cantidad}</Texto>
            </View>
          ))}
        </Tarjeta>
      </Seccion>

      <GrupoBotones>
        <Boton
          texto="Compartir seguimiento"
          variante="secundario"
          icono="share-social-outline"
          onPress={() => compartir(mensajeSeguimiento(parada.pedido.codigo, llegada, faltan))}
        />
      </GrupoBotones>
    </Pantalla>
  );
}
