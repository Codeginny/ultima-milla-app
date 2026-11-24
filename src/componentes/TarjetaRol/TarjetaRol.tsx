import { ActivityIndicator, Pressable, View } from 'react-native';

import { Icono, NombreIcono } from '@/componentes/Icono/Icono';
import { Texto } from '@/componentes/Texto/Texto';
import { crearEstilos } from '@/componentes/TarjetaRol/TarjetaRol.estilos';
import { useHaptica } from '@/hooks/useHaptica';
import { useEstilos, useTema } from '@/tema';

type Props = { icono: NombreIcono; titulo: string; texto: string; cargando?: boolean; onPress: () => void };

// Tarjeta grande para elegir con qué rol entrar a la demo: explica qué ve cada uno.
export function TarjetaRol({ icono, titulo, texto, cargando, onPress }: Props) {
  const e = useEstilos(crearEstilos);
  const { colores } = useTema();
  const haptica = useHaptica();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${texto}`}
      disabled={cargando}
      onPress={() => {
        haptica.toque();
        onPress();
      }}
      style={({ pressed }) => [e.tarjeta, pressed && e.presionada]}>
      <View style={e.icono}>
        <Icono nombre={icono} tamano={24} color="sobreAcento" />
      </View>
      <View style={e.textos}>
        <Texto variante="subtitulo">{titulo}</Texto>
        <Texto variante="chico">{texto}</Texto>
      </View>
      {cargando ? <ActivityIndicator color={colores.texto} /> : <Icono nombre="arrow-forward" tamano={22} color="titulo" />}
    </Pressable>
  );
}
