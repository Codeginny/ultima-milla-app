import { CONTRASENA_DEMO, usuariosDemo } from '@/datos/distribuidora';
import { fallar, responder } from '@/servicios/simulador';
import { Respuesta, Usuario } from '@/tipos';

// Inicio de sesión simulado: no hay servidor, se valida contra los usuarios de prueba.
export function ingresar(correo: string, contrasena: string): Promise<Respuesta<Usuario>> {
  const usuario = usuariosDemo.find((u) => u.correo === correo.trim().toLowerCase());
  if (!usuario || contrasena !== CONTRASENA_DEMO) {
    return fallar({ codigo: 'CREDENCIALES', mensaje: 'El correo o la contraseña no coinciden con un usuario de prueba.' });
  }
  return responder(usuario);
}
