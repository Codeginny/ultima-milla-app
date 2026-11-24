import { Redirect } from 'expo-router';

import { Cargando } from '@/componentes/Cargando/Cargando';
import { Pantalla } from '@/componentes/Pantalla/Pantalla';
import { useSesion } from '@/hooks/useSesion';

// La primera vez se explica la app; después cada rol entra a lo suyo: el chofer a la ruta, el cliente a su pedido.
export default function Entrada() {
  const { usuario, verificando, bienvenidaVista } = useSesion();
  if (verificando) {
    return (
      <Pantalla>
        <Cargando texto="Verificando sesión" centrado />
      </Pantalla>
    );
  }
  if (!usuario) return <Redirect href={bienvenidaVista ? '/login' : '/bienvenida'} />;
  return <Redirect href={usuario.rol === 'chofer' ? '/chofer' : '/cliente'} />;
}
