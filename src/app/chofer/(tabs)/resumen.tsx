import { router } from 'expo-router';
import { View } from 'react-native';

import { EsqueletoLista } from '@/componentes/Esqueleto/Esqueleto';
import { ErrorReintentar } from '@/componentes/Estados/Estados';
import { Cifra } from '@/componentes/Cifra/Cifra';
import { LineaTiempo, Hito } from '@/componentes/LineaTiempo/LineaTiempo';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Progreso } from '@/componentes/Progreso/Progreso';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { Texto } from '@/componentes/Texto/Texto';
import { useRuta } from '@/hooks/useRuta';
import { textoMotivo } from '@/utils/motivos';
import { duracionTexto, horaCorta, resumenJornada } from '@/utils/ruta';

// Resumen de la jornada del chofer: cifras grandes arriba y la línea de tiempo de lo que pasó.
export default function Resumen() {
  const { datos: ruta, error, cargando, recargar, ahora, jornada, estimadas } = useRuta();

  if (cargando || !ruta) {
    return <Pantalla conTabs>{error ? <ErrorReintentar error={error} onReintentar={recargar} /> : <EsqueletoLista variante="aviso" cantidad={3} />}</Pantalla>;
  }

  const r = resumenJornada(ruta, jornada.entregas, ahora);
  const hitos: Hito[] = [
    { id: 'salida', hora: horaCorta(new Date(ruta.salida)), titulo: `Salida de ${ruta.deposito.nombre.toLowerCase()}`, detalle: ruta.deposito.direccion, tipo: 'hecho' },
    ...estimadas.map(({ parada, estado, llegada }): Hito => {
      const entrega = jornada.entregas[parada.id];
      return {
        id: parada.id,
        hora: horaCorta(llegada),
        titulo: `${parada.orden}. ${parada.cliente.nombre}`,
        detalle:
          estado === 'entregada'
            ? `Entregada${entrega.receptor ? ` · recibió ${entrega.receptor}` : ''}${entrega.firmada ? ' · firmó' : ''}`
            : estado === 'no-entregada'
              ? `No entregada · ${textoMotivo(entrega.motivo)}`
              : 'Pendiente · hora estimada',
        tipo: estado === 'entregada' ? 'hecho' : estado === 'no-entregada' ? 'fallido' : 'pendiente',
        onPress: () => router.push({ pathname: '/chofer/parada/[id]', params: { id: parada.id } }),
      };
    }),
  ];

  return (
    <Pantalla conTabs onRefrescar={recargar}>
      <Tarjeta>
        <Texto variante="etiqueta">Jornada de hoy</Texto>
        <Texto variante="titulo">
          {r.entregadas + r.noEntregadas} de {r.total} paradas
        </Texto>
        <Progreso entregadas={r.entregadas} noEntregadas={r.noEntregadas} total={r.total} />
      </Tarjeta>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <Cifra valor={String(r.entregadas)} unidad={`de ${r.total}`} etiqueta="Entregadas" destacada />
        <Cifra valor={r.puntualidad === null ? '—' : `${r.puntualidad}`} unidad="%" etiqueta="Dentro de la franja" />
        <Cifra valor={r.kilometros.toLocaleString('es-AR')} unidad="km" etiqueta="Recorridos" />
        <Cifra valor={duracionTexto(r.minutosEnCalle)} etiqueta="En la calle" />
      </View>

      <Seccion titulo="Línea de tiempo" descripcion="Lo hecho, con quién recibió, y lo que falta con hora estimada">
        <LineaTiempo hitos={hitos} />
      </Seccion>
    </Pantalla>
  );
}
