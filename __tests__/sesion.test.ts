import { CONTRASENA_DEMO } from '@/datos/distribuidora';
import { ingresar } from '@/servicios/sesion';
import { validarCorreo } from '@/utils/validaciones';

jest.useFakeTimers();

async function resolver<T>(promesa: Promise<T>): Promise<T> {
  jest.runAllTimers();
  return promesa;
}

describe('sesión de prueba', () => {
  it('deja entrar al chofer de prueba', async () => {
    const r = await resolver(ingresar('Chofer@demo.com ', CONTRASENA_DEMO));
    expect('datos' in r && r.datos.rol).toBe('chofer');
  });

  it('rechaza una contraseña incorrecta', async () => {
    const r = await resolver(ingresar('cliente@demo.com', 'otra'));
    expect('error' in r && r.error.codigo).toBe('CREDENCIALES');
  });

  it('valida el formato del correo', () => {
    expect(validarCorreo('')).not.toBeNull();
    expect(validarCorreo('sin-arroba')).not.toBeNull();
    expect(validarCorreo('chofer@demo.com')).toBeNull();
  });
});
