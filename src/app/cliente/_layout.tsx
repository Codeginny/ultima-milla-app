import { Stack } from 'expo-router';

import { useTema } from '@/tema';
import { opcionesEncabezado } from '@/tema/navegacion';

export default function PilaCliente() {
  const tema = useTema();
  return (
    <Stack screenOptions={{ ...opcionesEncabezado(tema), contentStyle: { backgroundColor: tema.colores.fondo } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pedido/[codigo]" options={{ title: 'Comprobante' }} />
    </Stack>
  );
}
