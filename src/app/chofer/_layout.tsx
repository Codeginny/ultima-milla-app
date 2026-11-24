import { Stack } from 'expo-router';

import { useTema } from '@/tema';
import { opcionesEncabezado } from '@/tema/navegacion';

export default function PilaChofer() {
  const tema = useTema();
  return (
    <Stack screenOptions={{ ...opcionesEncabezado(tema), contentStyle: { backgroundColor: tema.colores.fondo } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="parada/[id]" options={{ title: 'Entrega' }} />
      <Stack.Screen name="confirmar/[id]" options={{ title: 'Confirmar entrega' }} />
      <Stack.Screen name="no-entregada/[id]" options={{ title: 'No se pudo entregar' }} />
    </Stack>
  );
}
