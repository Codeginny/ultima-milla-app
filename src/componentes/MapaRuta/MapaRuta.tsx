import { useMemo, useState } from 'react';
import { Image, LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import { Icono } from '@/componentes/Icono/Icono';
import { crearEstilos } from '@/componentes/MapaRuta/MapaRuta.estilos';
import { useEstilos, useTema } from '@/tema';
import type { Coordenadas } from '@/tipos';
import { aPixel, limitesDe, TAMANO_MOSAICO, zoomParaEncuadrar } from '@/utils/geo';

export type TipoMarcador = 'deposito' | 'pendiente' | 'siguiente' | 'entregada' | 'no-entregada' | 'destino';

export type Marcador = {
  id: string;
  coordenadas: Coordenadas;
  // Número de orden o una letra corta; el depósito y el destino llevan ícono.
  etiqueta: string;
  tipo: TipoMarcador;
  nombre: string;
};

export type Trazo = { camino: Coordenadas[]; hecho: boolean };

type Props = {
  marcadores: Marcador[];
  trazos: Trazo[];
  camion?: Coordenadas | null;
  alto?: number;
  onMarcador?: (id: string) => void;
  etiqueta: string;
};

const ZOOM_MINIMO = 3;
const ZOOM_MAXIMO = 19;

/**
 * Mapa liviano hecho con mosaicos de OpenStreetMap y una capa SVG para el recorrido.
 * No usa SDK nativo de mapas, así anda igual en Expo Go, en Android/iOS y en la web.
 */
export function MapaRuta({ marcadores, trazos, camion, alto = 280, onMarcador, etiqueta }: Props) {
  const e = useEstilos(crearEstilos);
  const { colores, esOscuro } = useTema();
  const [ancho, setAncho] = useState(0);
  const [ajusteZoom, setAjusteZoom] = useState(0);

  const puntos = useMemo(
    () => [...marcadores.map((m) => m.coordenadas), ...trazos.flatMap((t) => t.camino), ...(camion ? [camion] : [])],
    [marcadores, trazos, camion],
  );

  const vista = useMemo(() => {
    const limites = limitesDe(puntos);
    if (!limites || !ancho) return null;
    const base = zoomParaEncuadrar(limites, ancho, alto);
    const exacto = Math.min(ZOOM_MAXIMO, Math.max(ZOOM_MINIMO, base + ajusteZoom));
    // Los mosaicos vienen en zooms enteros: se pide el de abajo y se agranda para llegar al zoom exacto.
    const zoom = Math.floor(exacto);
    const escala = 2 ** (exacto - zoom);
    const lado = TAMANO_MOSAICO * escala;
    const pixel = (c: Coordenadas) => {
      const p = aPixel(c, zoom);
      return { x: p.x * escala, y: p.y * escala };
    };
    const a = pixel({ latitud: limites.norte, longitud: limites.oeste });
    const b = pixel({ latitud: limites.sur, longitud: limites.este });
    const izquierda = (a.x + b.x) / 2 - ancho / 2;
    const arriba = (a.y + b.y) / 2 - alto / 2;
    const enPantalla = (c: Coordenadas) => {
      const p = pixel(c);
      return { x: p.x - izquierda, y: p.y - arriba };
    };
    const mosaicos: { clave: string; uri: string; x: number; y: number }[] = [];
    for (let tx = Math.floor(izquierda / lado); tx <= Math.floor((izquierda + ancho) / lado); tx++) {
      for (let ty = Math.floor(arriba / lado); ty <= Math.floor((arriba + alto) / lado); ty++) {
        mosaicos.push({
          clave: `${zoom}/${tx}/${ty}`,
          uri: `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`,
          x: tx * lado - izquierda,
          y: ty * lado - arriba,
        });
      }
    }
    return { lado, mosaicos, enPantalla };
  }, [puntos, ancho, alto, ajusteZoom]);

  const medir = (ev: LayoutChangeEvent) => setAncho(Math.round(ev.nativeEvent.layout.width));

  const colorMarcador: Record<TipoMarcador, string> = {
    deposito: colores.encabezado,
    pendiente: colores.superficie,
    siguiente: colores.acento,
    entregada: colores.exito,
    'no-entregada': colores.error,
    destino: colores.acento,
  };
  const colorNumero: Record<TipoMarcador, string> = {
    deposito: colores.sobreEncabezado,
    pendiente: colores.texto,
    siguiente: colores.sobreAcento,
    entregada: esOscuro ? colores.sobreAcento : '#ffffff',
    'no-entregada': '#ffffff',
    destino: colores.sobreAcento,
  };

  return (
    <View style={[e.marco, { height: alto }]} onLayout={medir} accessible accessibilityLabel={etiqueta}>
      {vista && (
        <>
          {/* Se redondea y se suma un píxel para que no queden costuras entre mosaicos agrandados. */}
          {vista.mosaicos.map((m) => (
            <Image key={m.clave} source={{ uri: m.uri }} style={[e.mosaico, { left: Math.floor(m.x), top: Math.floor(m.y), width: Math.ceil(vista.lado) + 1, height: Math.ceil(vista.lado) + 1 }]} />
          ))}
          <View style={e.velo} pointerEvents="none" />
          <Svg width={ancho} height={alto} style={e.capa} pointerEvents="none">
            {trazos.map((t, i) => (
              <Polyline
                key={`brillo-${i}`}
                points={t.camino.map((c) => {
                  const p = vista.enPantalla(c);
                  return `${p.x},${p.y}`;
                }).join(' ')}
                fill="none"
                stroke={t.hecho ? 'transparent' : colores.acento}
                strokeOpacity={0.35}
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {trazos.map((t, i) => (
              <Polyline
                key={i}
                points={t.camino.map((c) => {
                  const p = vista.enPantalla(c);
                  return `${p.x},${p.y}`;
                }).join(' ')}
                fill="none"
                stroke={t.hecho ? colores.recorridoHecho : colores.recorrido}
                strokeWidth={t.hecho ? 4 : 6}
                strokeDasharray={t.hecho ? '6 6' : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </Svg>
          {marcadores.map((m) => {
            const p = vista.enPantalla(m.coordenadas);
            const conIcono = m.tipo === 'deposito' || m.tipo === 'destino';
            return (
              <Pressable
                key={m.id}
                accessibilityRole={onMarcador ? 'button' : undefined}
                accessibilityLabel={m.nombre}
                disabled={!onMarcador}
                onPress={() => onMarcador?.(m.id)}
                hitSlop={6}
                style={[e.marcador, m.tipo === 'siguiente' && e.marcadorGrande, { left: p.x, top: p.y, backgroundColor: colorMarcador[m.tipo] }]}>
                {conIcono ? (
                  <Icono nombre={m.tipo === 'deposito' ? 'business' : 'flag'} tamano={14} color={m.tipo === 'deposito' ? 'sobreEncabezado' : 'sobreAcento'} />
                ) : (
                  <Text style={[e.numero, { color: colorNumero[m.tipo] }]}>{m.etiqueta}</Text>
                )}
              </Pressable>
            );
          })}
          {camion && (
            <View
              style={[e.camion, { left: vista.enPantalla(camion).x, top: vista.enPantalla(camion).y }]}
              accessibilityLabel="Ubicación del camión"
              pointerEvents="none">
              <Icono nombre="car" tamano={20} color="sobreInsignia" />
            </View>
          )}
          <View style={e.zoom}>
            <Pressable accessibilityRole="button" accessibilityLabel="Acercar" style={e.botonZoom} onPress={() => setAjusteZoom((z) => z + 1)}>
              <Icono nombre="add" tamano={20} color="titulo" />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Alejar" style={e.botonZoom} onPress={() => setAjusteZoom((z) => z - 1)}>
              <Icono nombre="remove" tamano={20} color="titulo" />
            </Pressable>
          </View>
          <Text style={e.atribucion}>© OpenStreetMap</Text>
        </>
      )}
    </View>
  );
}
