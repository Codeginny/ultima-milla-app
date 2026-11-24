import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icono, NombreIcono } from '@/componentes/Icono/Icono';
import { crearEstilos } from '@/componentes/Navegacion/BarraTabs.estilos';
import { useHaptica } from '@/hooks/useHaptica';
import { useEstilos } from '@/tema';

type PropsBarra = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export type PestanaConfig = { titulo: string; etiqueta: string; icono: NombreIcono; iconoActivo: NombreIcono };

// Barra flotante en forma de píldora: la pestaña activa se enciende en lima; todas llevan texto.
export function BarraTabs({ state, navigation, pestanas }: PropsBarra & { pestanas: Record<string, PestanaConfig> }) {
  const e = useEstilos(crearEstilos);
  const haptica = useHaptica();
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[e.contenedor, { paddingBottom: Math.max(bottom, 14) }]} pointerEvents="box-none">
      <View style={e.pildora} accessibilityRole="tablist">
        {state.routes.map((ruta, i) => {
          const activa = state.index === i;
          const p = pestanas[ruta.name];
          if (!p) return null;
          const ir = () => {
            haptica.toque();
            const evento = navigation.emit({ type: 'tabPress', target: ruta.key, canPreventDefault: true });
            if (!activa && !evento.defaultPrevented) navigation.navigate(ruta.name);
          };
          return (
            <Pressable
              key={ruta.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: activa }}
              accessibilityLabel={p.etiqueta}
              onPress={ir}
              style={[e.pestana, activa && e.activa]}>
              <Icono nombre={activa ? p.iconoActivo : p.icono} tamano={20} color={activa ? 'sobreAcento' : 'sobreBarra'} />
              <Text style={[e.texto, !activa && e.textoInactivo]}>{p.etiqueta}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
