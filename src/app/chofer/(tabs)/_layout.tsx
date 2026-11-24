import { Tabs } from 'expo-router';

import { BarraTabs, PestanaConfig } from '@/componentes/Navegacion/BarraTabs';
import { useTema } from '@/tema';
import { opcionesEncabezado } from '@/tema/navegacion';

const pestanas: Record<string, PestanaConfig> = {
  index: { titulo: 'Mi ruta de hoy', etiqueta: 'Ruta', icono: 'map-outline', iconoActivo: 'map' },
  resumen: { titulo: 'Resumen del día', etiqueta: 'Resumen', icono: 'stats-chart-outline', iconoActivo: 'stats-chart' },
  perfil: { titulo: 'Perfil', etiqueta: 'Perfil', icono: 'person-outline', iconoActivo: 'person' },
};

export default function PestanasChofer() {
  const tema = useTema();
  return (
    <Tabs tabBar={(props) => <BarraTabs {...props} pestanas={pestanas} />} screenOptions={{ ...opcionesEncabezado(tema) }}>
      {Object.entries(pestanas).map(([nombre, p]) => (
        <Tabs.Screen key={nombre} name={nombre} options={{ title: p.titulo }} />
      ))}
    </Tabs>
  );
}
