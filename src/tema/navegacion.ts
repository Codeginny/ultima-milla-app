import { DarkTheme, DefaultTheme, Theme } from 'expo-router';

import { fuentes, Tema } from '@/tema';

// Tema de React Navigation armado con nuestros colores (evita fondos blancos en modo oscuro).
export function temaDeNavegacion({ colores, esOscuro }: Tema): Theme {
  const base = esOscuro ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colores.acento,
      background: colores.fondo,
      card: colores.superficie,
      text: colores.texto,
      border: colores.borde,
      notification: colores.insignia,
    },
  };
}

// Encabezado grafito con título en Space Grotesk, igual en todas las pilas y pestañas.
export function opcionesEncabezado({ colores }: Tema) {
  return {
    headerStyle: { backgroundColor: colores.encabezado },
    headerTintColor: colores.sobreEncabezado,
    headerTitleStyle: { fontFamily: fuentes.negrita, fontSize: 18 },
    headerShadowVisible: false,
  };
}
