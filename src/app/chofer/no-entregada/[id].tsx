import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';

import { Boton } from '@/componentes/Boton/Boton';
import { EstadoVacio } from '@/componentes/Estados/Estados';
import { Icono } from '@/componentes/Icono/Icono';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Texto } from '@/componentes/Texto/Texto';
import { useHaptica } from '@/hooks/useHaptica';
import { useJornada } from '@/hooks/useJornada';
import { useRuta } from '@/hooks/useRuta';
import { useTema } from '@/tema';
import { MotivoNoEntrega } from '@/tipos';
import { motivos } from '@/utils/motivos';

// Registrar una entrega que no se pudo hacer: el motivo en un toque y, si quiere, una foto como prueba.
export default function NoEntregada() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { datos: ruta } = useRuta();
  const { marcarNoEntregada } = useJornada();
  const haptica = useHaptica();
  const { colores } = useTema();
  const [motivo, setMotivo] = useState<MotivoNoEntrega | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const parada = ruta?.paradas.find((p) => p.id === id);

  if (!parada) {
    return (
      <Pantalla>
        <EstadoVacio icono="help-circle-outline" titulo="No encontramos esta parada" />
      </Pantalla>
    );
  }

  const sacarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    // Sin cámara (o en la web) se puede elegir una foto de la galería.
    const r = permiso.granted
      ? await ImagePicker.launchCameraAsync({ quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.5, mediaTypes: ['images'] });
    if (!r.canceled) setFoto(r.assets[0].uri);
  };

  const registrar = () => {
    if (!motivo) return;
    marcarNoEntregada(parada.id, motivo, foto ?? undefined);
    haptica.error();
    router.dismissTo('/chofer');
  };

  return (
    <Pantalla
      pie={
        <>
          <Boton variante="acento" texto="Registrar y seguir" icono="arrow-forward" deshabilitado={!motivo} onPress={registrar} />
          {!motivo && (
            <Texto variante="chico" centrado>
              Elegí qué pasó para seguir.
            </Texto>
          )}
        </>
      }>
      <View>
        <Texto variante="etiqueta">
          Parada {parada.orden} · Pedido {parada.pedido.codigo}
        </Texto>
        <Texto variante="subtitulo">{parada.cliente.nombre}</Texto>
      </View>

      <Seccion titulo="¿Qué pasó?" descripcion="El cliente ve el motivo en el seguimiento de su pedido.">
        <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
          {motivos.map((m) => {
            const elegido = motivo === m.valor;
            return (
              <Pressable
                key={m.valor}
                accessibilityRole="radio"
                accessibilityState={{ checked: elegido }}
                onPress={() => {
                  haptica.toque();
                  setMotivo(m.valor);
                }}
                style={{
                  minHeight: 56,
                  borderRadius: 14,
                  borderWidth: elegido ? 2 : 1.5,
                  borderColor: elegido ? colores.titulo : colores.bordeControl,
                  backgroundColor: colores.superficie,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 16,
                }}>
                <Icono nombre={elegido ? 'radio-button-on' : 'radio-button-off'} tamano={22} color="texto" />
                <Texto variante={elegido ? 'destacado' : undefined}>{m.texto}</Texto>
              </Pressable>
            );
          })}
        </View>
      </Seccion>

      <Seccion titulo="Foto (opcional)" descripcion="De la persiana o del local, por si después hay que explicarlo.">
        {foto ? (
          <>
            <Image source={{ uri: foto }} style={{ width: '100%', height: 200, borderRadius: 14 }} accessibilityLabel="Foto de la parada" />
            <Boton texto="Sacar otra" variante="texto" icono="camera-outline" onPress={sacarFoto} />
          </>
        ) : (
          <Boton texto="Sacar foto" variante="secundario" icono="camera-outline" onPress={sacarFoto} />
        )}
      </Seccion>
    </Pantalla>
  );
}
