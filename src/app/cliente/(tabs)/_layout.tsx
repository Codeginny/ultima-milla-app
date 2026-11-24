import { Tabs } from 'expo-router';

import { BarraTabs, PestanaConfig } from '@/componentes/Navegacion/BarraTabs';
import { useTema } from '@/tema';
import { opcionesEncabezado } from '@/tema/navegacion';

const pestanas: Record<string, PestanaConfig> = {
  index: { titulo: 'Mi pedido', etiqueta: 'Pedido', icono: 'navigate-circle-outline', iconoActivo: 'navigate-circle' },
  pedidos: { titulo: 'Mis pedidos', etiqueta: 'Historial', icono: 'receipt-outline', iconoActivo: 'receipt' },
  perfil: { titulo: 'Perfil', etiqueta: 'Perfil', icono: 'person-outline', iconoActivo: 'person' },
};

export default function PestanasCliente() {
  const tema = useTema();
  return (
    <Tabs tabBar={(props) => <BarraTabs {...props} pestanas={pestanas} />} screenOptions={{ ...opcionesEncabezado(tema) }}>
      {Object.entries(pestanas).map(([nombre, p]) => (
        <Tabs.Screen key={nombre} name={nombre} options={{ title: p.titulo }} />
      ))}
    </Tabs>
  );
}
