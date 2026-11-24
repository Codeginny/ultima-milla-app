import { router } from 'expo-router';
import { StyleSheet, Switch, View } from 'react-native';

import { Boton } from '@/componentes/Boton/Boton';
import { GrupoBotones } from '@/componentes/Boton/GrupoBotones';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Segmentos } from '@/componentes/Segmentos/Segmentos';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { Texto } from '@/componentes/Texto/Texto';
import { EMPRESA, vehiculoDemo } from '@/datos/distribuidora';
import { useJornada } from '@/hooks/useJornada';
import { ModoTema, usePreferencias } from '@/hooks/usePreferencias';
import { useSesion } from '@/hooks/useSesion';
import { useTema } from '@/tema';

const modos: { valor: ModoTema; texto: string }[] = [
  { valor: 'sistema', texto: 'Sistema' },
  { valor: 'claro', texto: 'Claro' },
  { valor: 'oscuro', texto: 'Oscuro' },
];

// Perfil de los dos roles: datos de la cuenta, apariencia, ayuda y la demo.
export function Perfil() {
  const { modoTema, cambiarModoTema, haptica, cambiarHaptica } = usePreferencias();
  const { usuario, salir } = useSesion();
  const iniciales = (usuario?.nombre ?? '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const { reiniciar } = useJornada();
  const { colores } = useTema();

  const cerrarSesion = () => {
    salir();
    router.replace('/login');
  };

  return (
    <Pantalla conTabs>
      {usuario && (
        <Tarjeta enFila>
          <View style={[estilos.avatar, { backgroundColor: colores.acento }]}>
            <Texto variante="subtitulo" style={{ color: colores.sobreAcento }}>
              {iniciales}
            </Texto>
          </View>
          <View style={{ flex: 1 }}>
            <Texto variante="subtitulo">{usuario.nombre}</Texto>
            <Texto variante="chico">
              {usuario.correo} · {usuario.rol === 'chofer' ? `Chofer de ${EMPRESA}` : `Cliente de ${EMPRESA}`}
            </Texto>
            {usuario.rol === 'chofer' && (
              <Texto variante="chico">
                {vehiculoDemo.modelo} · {vehiculoDemo.patente}
              </Texto>
            )}
          </View>
        </Tarjeta>
      )}

      <Seccion titulo="Apariencia">
        <Segmentos opciones={modos} valor={modoTema} onCambiar={cambiarModoTema} />
        <Tarjeta enFila>
          <View style={{ flex: 1 }}>
            <Texto variante="destacado">Vibración</Texto>
            <Texto variante="chico">Una vibración corta al tocar botones y marcar entregas.</Texto>
          </View>
          <Switch
            value={haptica}
            onValueChange={cambiarHaptica}
            trackColor={{ true: colores.primario, false: colores.borde }}
            thumbColor={haptica ? colores.insignia : colores.superficie}
            {...{ activeThumbColor: colores.insignia }}
            accessibilityLabel="Vibración"
          />
        </Tarjeta>
      </Seccion>

      <Seccion titulo="Ayuda">
        <Boton texto="Cómo funciona Última Milla" variante="secundario" icono="help-circle-outline" onPress={() => router.push('/bienvenida')} />
      </Seccion>

      <Seccion titulo="Demo" descripcion={`${EMPRESA} es una empresa ficticia; todos los datos son simulados.`}>
        <GrupoBotones>
          <Boton texto="Reiniciar la ruta de hoy" variante="secundario" icono="refresh" onPress={reiniciar} />
        </GrupoBotones>
        <Texto variante="chico">
          Vuelve a poner el camión en la calle con dos entregas hechas. Para ver cómo cambia el seguimiento, marcá entregas como chofer y
          después entrá como cliente.
        </Texto>
      </Seccion>

      {usuario && <Boton texto="Cerrar sesión" variante="peligro" icono="log-out-outline" onPress={cerrarSesion} />}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
