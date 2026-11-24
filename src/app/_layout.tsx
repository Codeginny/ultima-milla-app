import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold, useFonts } from '@expo-google-fonts/space-grotesk';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProveedorJornada } from '@/hooks/useJornada';
import { ProveedorPreferencias, usePreferencias } from '@/hooks/usePreferencias';
import { ProveedorSesion } from '@/hooks/useSesion';
import { useTema } from '@/tema';
import { temaDeNavegacion } from '@/tema/navegacion';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Navegacion() {
  const tema = useTema();
  const { cargadas } = usePreferencias();

  useEffect(() => {
    if (cargadas) SplashScreen.hideAsync().catch(() => {});
  }, [cargadas]);

  return (
    <ThemeProvider value={temaDeNavegacion(tema)}>
      <StatusBar style="light" />
      {/* Cada rol tiene su propia pila con pestañas; la raíz solo reparte. */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: tema.colores.fondo } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="bienvenida" />
        <Stack.Screen name="login" />
        <Stack.Screen name="chofer" />
        <Stack.Screen name="cliente" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RaizApp() {
  const [fuentesListas] = useFonts({ SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold });
  if (!fuentesListas) return null;
  return (
    <SafeAreaProvider>
      <ProveedorPreferencias>
        <ProveedorSesion>
          <ProveedorJornada>
            <Navegacion />
          </ProveedorJornada>
        </ProveedorSesion>
      </ProveedorPreferencias>
    </SafeAreaProvider>
  );
}
