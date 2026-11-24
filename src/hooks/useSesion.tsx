import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { guardarPreferencia, leerPreferencia } from '@/db/preferencias';
import { ingresar as ingresarServicio } from '@/servicios/sesion';
import { ErrorApi, Usuario } from '@/tipos';

const CLAVE = 'ultimamilla.sesion';
const CLAVE_BIENVENIDA = 'ultimamilla.bienvenida';

type Sesion = {
  usuario: Usuario | null;
  verificando: boolean;
  // La bienvenida explica la app la primera vez; después se puede volver a ver desde el perfil.
  bienvenidaVista: boolean;
  marcarBienvenida: () => void;
  ingresar: (correo: string, contrasena: string) => Promise<ErrorApi | null>;
  salir: () => void;
};

const ContextoSesion = createContext<Sesion | null>(null);

// Sesión de prueba guardada en el teléfono. No hay tokens: los usuarios son de demostración.
export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [verificando, setVerificando] = useState(true);
  const [bienvenidaVista, setBienvenidaVista] = useState(false);

  useEffect(() => {
    Promise.all([leerPreferencia(CLAVE), leerPreferencia(CLAVE_BIENVENIDA)]).then(([texto, vista]) => {
      try {
        if (texto) setUsuario(JSON.parse(texto));
      } catch {
        // Sesión guardada ilegible: se vuelve a iniciar.
      }
      setBienvenidaVista(vista === 'si');
      setVerificando(false);
    });
  }, []);

  const marcarBienvenida = useCallback(() => {
    setBienvenidaVista(true);
    guardarPreferencia(CLAVE_BIENVENIDA, 'si');
  }, []);

  const ingresar = useCallback(async (correo: string, contrasena: string) => {
    const r = await ingresarServicio(correo, contrasena);
    if ('error' in r) return r.error;
    setUsuario(r.datos);
    await guardarPreferencia(CLAVE, JSON.stringify(r.datos));
    return null;
  }, []);

  const salir = useCallback(() => {
    setUsuario(null);
    guardarPreferencia(CLAVE, '');
  }, []);

  const valor = useMemo(
    () => ({ usuario, verificando, bienvenidaVista, marcarBienvenida, ingresar, salir }),
    [usuario, verificando, bienvenidaVista, marcarBienvenida, ingresar, salir],
  );
  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>;
}

export function useSesion(): Sesion {
  const ctx = useContext(ContextoSesion);
  if (!ctx) throw new Error('useSesion debe usarse dentro de ProveedorSesion');
  return ctx;
}
