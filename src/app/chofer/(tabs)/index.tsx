import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Boton } from '@/componentes/Boton/Boton';
import { CampoTexto } from '@/componentes/CampoTexto/CampoTexto';
import { EsqueletoLista } from '@/componentes/Esqueleto/Esqueleto';
import { EstadoVacio, ErrorReintentar } from '@/componentes/Estados/Estados';
import { FilaParada } from '@/componentes/FilaParada/FilaParada';
import { MapaRuta } from '@/componentes/MapaRuta/MapaRuta';
import { capasDeRuta } from '@/componentes/MapaRuta/marcadores';
import { Notificacion } from '@/componentes/Notificacion/Notificacion';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Progreso } from '@/componentes/Progreso/Progreso';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { Texto } from '@/componentes/Texto/Texto';
import { useRuta } from '@/hooks/useRuta';
import { comoLlegar } from '@/servicios/navegar';
import { faltaTexto, filtrarParadas, horaCorta, minutosHasta, progreso } from '@/utils/ruta';

// Ruta del día del chofer: avance, mapa con las paradas en orden y la lista para marcar entregas.
export default function MiRuta() {
  const { datos: ruta, error, cargando, recargar, estimadas, camion, ahora, jornada } = useRuta();
  const [busqueda, setBusqueda] = useState('');


  if (cargando || !ruta) {
    return (
      <Pantalla conTabs>
        {error ? <ErrorReintentar error={error} onReintentar={recargar} /> : <EsqueletoLista variante="horario" cantidad={4} />}
      </Pantalla>
    );
  }

  const avance = progreso(ruta, jornada.entregas);
  const siguiente = estimadas.find((p) => p.estado === 'pendiente');
  const { marcadores, trazos } = capasDeRuta(ruta, estimadas);
  const visibles = new Set(filtrarParadas(ruta.paradas, busqueda).map((p) => p.id));
  const abrir = (id: string) => router.push({ pathname: '/chofer/parada/[id]', params: { id } });

  return (
    <Pantalla conTabs onRefrescar={recargar}>
      <Tarjeta>
        <View>
          <Texto variante="etiqueta">{ruta.empresa}</Texto>
          <Texto variante="subtitulo">
            {avance.entregadas + avance.noEntregadas} de {avance.total} paradas resueltas
          </Texto>
          <Texto variante="chico">
            {ruta.vehiculo.modelo} · {ruta.vehiculo.patente}
          </Texto>
        </View>
        <Progreso entregadas={avance.entregadas} noEntregadas={avance.noEntregadas} total={avance.total} />
        <Texto variante="chico">
          {avance.entregadas} entregadas · {avance.noEntregadas} sin entregar · {avance.pendientes} pendientes
        </Texto>
      </Tarjeta>

      {siguiente ? (
        <Tarjeta destacada>
          <View>
            <Texto variante="etiqueta">Próxima entrega · parada {siguiente.parada.orden}</Texto>
            <Texto variante="subtitulo">{siguiente.parada.cliente.nombre}</Texto>
            <Texto variante="chico">
              {siguiente.parada.direccion} · llegás {horaCorta(siguiente.llegada)} ({faltaTexto(minutosHasta(siguiente.llegada, ahora))}) · recibe de{' '}
              {siguiente.parada.ventana.desde} a {siguiente.parada.ventana.hasta}
            </Texto>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Boton texto="Ir" variante="secundario" icono="navigate-outline" onPress={() => comoLlegar(siguiente.parada.coordenadas)} />
            </View>
            <View style={{ flex: 1 }}>
              <Boton texto="Entregar" variante="acento" icono="create-outline" onPress={() => router.push({ pathname: '/chofer/confirmar/[id]', params: { id: siguiente.parada.id } })} />
            </View>
          </View>
        </Tarjeta>
      ) : (
        <Notificacion tipo="exito" titulo="Ruta terminada" mensaje="Ya resolviste todas las paradas de hoy. Podés volver al depósito." />
      )}

      <MapaRuta marcadores={marcadores} trazos={trazos} camion={camion} onMarcador={(id) => id !== 'deposito' && abrir(id)} etiqueta="Mapa de la ruta de hoy" />

      <Seccion titulo="Paradas" descripcion="En el orden en que conviene recorrerlas">
        <CampoTexto etiqueta="Buscar" tipo="busqueda" valor={busqueda} onCambiar={setBusqueda} placeholder="Cliente, dirección, barrio o pedido" />
        {visibles.size ? (
          estimadas
            .filter((p) => visibles.has(p.parada.id))
            .map((p) => (
              <FilaParada
                key={p.parada.id}
                parada={p.parada}
                estado={p.estado}
                llegada={p.llegada}
                ahora={ahora}
                esSiguiente={p.parada.id === siguiente?.parada.id}
                onPress={() => abrir(p.parada.id)}
              />
            ))
        ) : (
          <EstadoVacio icono="search" titulo="Sin resultados" mensaje={`Ninguna parada coincide con “${busqueda}”.`} />
        )}
      </Seccion>
    </Pantalla>
  );
}
