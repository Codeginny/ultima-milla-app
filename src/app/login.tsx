import { router } from 'expo-router';
import { useState } from 'react';

import { Boton } from '@/componentes/Boton/Boton';
import { CampoTexto } from '@/componentes/CampoTexto/CampoTexto';
import { Portada } from '@/componentes/Navegacion/Portada';
import { Notificacion } from '@/componentes/Notificacion/Notificacion';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Separador } from '@/componentes/Separador/Separador';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { TarjetaRol } from '@/componentes/TarjetaRol/TarjetaRol';
import { Texto } from '@/componentes/Texto/Texto';
import { CONTRASENA_DEMO, usuariosDemo } from '@/datos/distribuidora';
import { useHaptica } from '@/hooks/useHaptica';
import { useSesion } from '@/hooks/useSesion';
import { Rol } from '@/tipos';
import { validarCorreo } from '@/utils/validaciones';

export default function Login() {
  const { ingresar } = useSesion();
  const haptica = useHaptica();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState<{ correo?: string; contrasena?: string }>({});
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<Rol | 'formulario' | null>(null);

  const cambiarCorreo = (v: string) => {
    setCorreo(v);
    setErrores((e) => ({ ...e, correo: undefined }));
  };

  const cambiarContrasena = (v: string) => {
    setContrasena(v);
    setErrores((e) => ({ ...e, contrasena: undefined }));
  };

  const entrar = async (c: string, clave: string, origen: Rol | 'formulario') => {
    setErrorServidor(null);
    setEnviando(origen);
    const error = await ingresar(c, clave);
    setEnviando(null);
    if (error) {
      setErrorServidor(error.mensaje);
      haptica.error();
      return;
    }
    haptica.exito();
    setContrasena('');
    router.replace('/');
  };

  const enviar = () => {
    const nuevos = {
      correo: validarCorreo(correo) ?? undefined,
      contrasena: contrasena ? undefined : 'Escribí tu contraseña.',
    };
    setErrores(nuevos);
    if (nuevos.correo || nuevos.contrasena) {
      haptica.error();
      return;
    }
    entrar(correo, contrasena, 'formulario');
  };

  const entrarComo = (rol: Rol) => {
    const usuario = usuariosDemo.find((u) => u.rol === rol);
    if (usuario) entrar(usuario.correo, CONTRASENA_DEMO, rol);
  };

  return (
    <Pantalla
      cabecera={
        <Portada titulo="Cada entrega," resaltado="a la vista." bajada="El reparto del día de una distribuidora: el chofer con su ruta en orden y cada cliente sabiendo cuándo llega su pedido." />
      }>
      <Seccion titulo="¿Cómo querés entrar?" descripcion="Demo con datos simulados de una distribuidora ficticia.">
        <TarjetaRol
          icono="car-sport-outline"
          titulo="Soy chofer"
          texto="Ruta del día ordenada en el mapa, entregas con firma y resumen de la jornada."
          cargando={enviando === 'chofer'}
          onPress={() => entrarComo('chofer')}
        />
        <TarjetaRol
          icono="storefront-outline"
          titulo="Soy cliente"
          texto="Seguí tu pedido en el mapa, recibí el aviso 10 minutos antes y mirá tus comprobantes."
          cargando={enviando === 'cliente'}
          onPress={() => entrarComo('cliente')}
        />
        <Boton texto="¿Qué es Última Milla?" variante="texto" icono="help-circle-outline" onPress={() => router.push('/bienvenida')} />
      </Seccion>

      <Separador texto="o con tu usuario" />

      <Seccion titulo="Iniciar sesión">
        {!!errorServidor && <Notificacion tipo="error" titulo="No pudimos iniciar sesión" mensaje={errorServidor} />}
        <CampoTexto etiqueta="Correo" tipo="correo" valor={correo} onCambiar={cambiarCorreo} placeholder="nombre@correo.com" error={errores.correo} />
        <CampoTexto
          etiqueta="Contraseña"
          tipo="contrasena"
          valor={contrasena}
          onCambiar={cambiarContrasena}
          placeholder="Tu contraseña"
          error={errores.contrasena}
          onEnviar={enviar}
        />
        <Boton texto="Ingresar" icono="log-in-outline" cargando={enviando === 'formulario'} onPress={enviar} />
      </Seccion>

      <Tarjeta>
        <Texto variante="etiqueta">Usuarios de prueba</Texto>
        {usuariosDemo.map((u) => (
          <Texto key={u.id} variante="chico">
            {u.rol === 'chofer' ? 'Chofer' : 'Cliente'}: {u.correo} · contraseña {CONTRASENA_DEMO}
          </Texto>
        ))}
      </Tarjeta>
    </Pantalla>
  );
}
