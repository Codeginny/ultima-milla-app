import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { jornadaDemo } from '@/datos/distribuidora';
import { guardarPreferencia, leerPreferencia } from '@/db/preferencias';
import { Entregas, MotivoNoEntrega } from '@/tipos';

const CLAVE = 'ultimamilla.jornada';
// Pasadas 10 horas de la salida, la jornada guardada se da por terminada y arranca otra de demostración.
const VIGENCIA_MS = 10 * 60 * 60_000;

type Guardada = { salida: string; entregas: Entregas };

type Jornada = Guardada & {
  cargada: boolean;
  marcarEntregada: (paradaId: string, receptor: string) => void;
  marcarNoEntregada: (paradaId: string, motivo: MotivoNoEntrega) => void;
  deshacer: (paradaId: string) => void;
  reiniciar: () => void;
};

const ContextoJornada = createContext<Jornada | null>(null);

/**
 * Estado del día compartido por las dos vistas: lo que marca el chofer se ve en el seguimiento del
 * cliente. En la demo vive en el teléfono; con backend se sincronizaría con el servidor.
 */
export function ProveedorJornada({ children }: { children: ReactNode }) {
  const [jornada, setJornada] = useState<Guardada>(() => jornadaDemo(new Date()));
  const [cargada, setCargada] = useState(false);

  useEffect(() => {
    leerPreferencia(CLAVE).then((texto) => {
      try {
        const guardada: Guardada | null = texto ? JSON.parse(texto) : null;
        if (guardada && Date.now() - new Date(guardada.salida).getTime() < VIGENCIA_MS) {
          setJornada(guardada);
          setCargada(true);
          return;
        }
      } catch {
        // Si no se puede leer, arranca una jornada nueva.
      }
      // Se guarda enseguida para que chofer y cliente vean la misma ruta aunque se recargue la app.
      const nueva = jornadaDemo(new Date());
      setJornada(nueva);
      guardarPreferencia(CLAVE, JSON.stringify(nueva));
      setCargada(true);
    });
  }, []);

  const actualizar = useCallback((cambio: (j: Guardada) => Guardada) => {
    setJornada((actual) => {
      const nueva = cambio(actual);
      guardarPreferencia(CLAVE, JSON.stringify(nueva));
      return nueva;
    });
  }, []);

  const marcarEntregada = useCallback(
    (paradaId: string, receptor: string) =>
      actualizar((j) => ({
        ...j,
        entregas: { ...j.entregas, [paradaId]: { estado: 'entregada', hora: new Date().toISOString(), receptor, firmada: true } },
      })),
    [actualizar],
  );

  const marcarNoEntregada = useCallback(
    (paradaId: string, motivo: MotivoNoEntrega) =>
      actualizar((j) => ({
        ...j,
        entregas: { ...j.entregas, [paradaId]: { estado: 'no-entregada', hora: new Date().toISOString(), motivo } },
      })),
    [actualizar],
  );

  const deshacer = useCallback(
    (paradaId: string) =>
      actualizar((j) => {
        const { [paradaId]: _quitada, ...resto } = j.entregas;
        return { ...j, entregas: resto };
      }),
    [actualizar],
  );

  const reiniciar = useCallback(() => actualizar(() => jornadaDemo(new Date())), [actualizar]);

  const valor = useMemo(
    () => ({ ...jornada, cargada, marcarEntregada, marcarNoEntregada, deshacer, reiniciar }),
    [jornada, cargada, marcarEntregada, marcarNoEntregada, deshacer, reiniciar],
  );
  return <ContextoJornada.Provider value={valor}>{children}</ContextoJornada.Provider>;
}

export function useJornada(): Jornada {
  const ctx = useContext(ContextoJornada);
  if (!ctx) throw new Error('useJornada debe usarse dentro de ProveedorJornada');
  return ctx;
}
