import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Boton } from '@/componentes/Boton/Boton';
import { Ilustracion, Escena } from '@/componentes/Ilustracion/Ilustracion';
import { Logo } from '@/componentes/Logo/Logo';
import { useSesion } from '@/hooks/useSesion';
import { crearEstilos } from '@/app-estilos/bienvenida.estilos';
import { useEstilos } from '@/tema';

const pasos: { escena: Escena; etiqueta: string; titulo: string; resaltado: string; texto: string; puntos: string[] }[] = [
  {
    escena: 'reparto',
    etiqueta: 'Qué es',
    titulo: 'El último tramo del reparto,',
    resaltado: 'ordenado.',
    texto: 'Última Milla conecta a una distribuidora con sus choferes y sus clientes durante el reparto del día: del depósito a la puerta de cada comercio.',
    puntos: ['Para distribuidoras que entregan a almacenes, kioscos y bares', 'Una sola ruta del día que ven el chofer y los clientes'],
  },
  {
    escena: 'chofer',
    etiqueta: 'Para el chofer',
    titulo: 'Tu ruta en orden,',
    resaltado: 'parada por parada.',
    texto: 'El chofer ve las paradas numeradas en el mapa, con la hora estimada de cada una, y marca cada entrega con el nombre y la firma de quien recibe.',
    puntos: ['Mapa con el recorrido y la próxima parada', 'Entregas con firma o con motivo si no se pudo', 'Resumen del día: entregas, kilómetros y puntualidad'],
  },
  {
    escena: 'cliente',
    etiqueta: 'Para el cliente',
    titulo: 'Sabés cuándo llega',
    resaltado: 'tu pedido.',
    texto: 'El comercio sigue el camión en el mapa, ve cuántas entregas faltan antes de la suya y recibe un aviso cuando quedan 10 minutos.',
    puntos: ['Seguimiento en vivo con hora estimada', 'Aviso 10 minutos antes', 'Historial de pedidos con comprobante'],
  },
];

// Bienvenida de tres pasos: explica qué es la app y para quién antes del login. También se abre desde el perfil.
export default function Bienvenida() {
  const e = useEstilos(crearEstilos);
  const { marcarBienvenida, usuario } = useSesion();
  const [paso, setPaso] = useState(0);
  const actual = pasos[paso];
  const ultimo = paso === pasos.length - 1;

  const terminar = () => {
    marcarBienvenida();
    if (usuario) router.back();
    else router.replace('/login');
  };

  return (
    <SafeAreaView style={e.fondo} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={e.contenido}>
        <View style={e.arriba}>
          <Logo conPalabra sobreOscuro />
          {!ultimo && (
            <Pressable accessibilityRole="button" onPress={terminar} hitSlop={10}>
              <Text style={e.saltar}>Saltar</Text>
            </Pressable>
          )}
        </View>

        <Ilustracion escena={actual.escena} />

        <View style={e.textos}>
          <Text style={e.etiqueta}>
            {String(paso + 1).padStart(2, '0')} / {actual.etiqueta}
          </Text>
          <Text style={e.titulo}>
            {actual.titulo} <Text style={e.resaltado}>{actual.resaltado}</Text>
          </Text>
          <Text style={e.texto}>{actual.texto}</Text>
          <View style={e.puntos}>
            {actual.puntos.map((p) => (
              <View key={p} style={e.punto}>
                <View style={e.vineta} />
                <Text style={e.textoPunto}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={e.abajo}>
          <View style={e.indicador} accessibilityLabel={`Paso ${paso + 1} de ${pasos.length}`}>
            {pasos.map((p, i) => (
              <View key={p.escena} style={[e.marca, i === paso && e.marcaActiva]} />
            ))}
          </View>
          <Boton variante="acento" texto={ultimo ? 'Empezar' : 'Siguiente'} icono={ultimo ? 'arrow-forward' : undefined} onPress={ultimo ? terminar : () => setPaso(paso + 1)} />
          {paso > 0 && (
            <Pressable accessibilityRole="button" onPress={() => setPaso(paso - 1)} style={e.atras}>
              <Text style={e.saltar}>Atrás</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
