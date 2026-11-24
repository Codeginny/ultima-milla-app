import { useCallback, useEffect, useRef, useState } from 'react';

import { guardarPreferencia, leerPreferencia } from '@/db/preferencias';
import { cancelarAviso, programarAviso, ResultadoAviso } from '@/servicios/avisos';

const CLAVE = 'ultimamilla.aviso';
// Si la llegada estimada se mueve más que esto, el aviso se vuelve a programar.
const TOLERANCIA_MS = 2 * 60_000;

type Guardado = { codigo: string; llegada: string; id: string | null };

/**
 * "Avisarme 10 minutos antes": recuerda si el cliente lo pidió y, cuando el camión se atrasa o se
 * adelanta, corre la notificación programada para que siga sonando a tiempo.
 */
export function useAvisoLlegada(codigo: string, llegada: Date | null, pendiente: boolean) {
  const [guardado, setGuardado] = useState<Guardado | null>(null);
  const [resultado, setResultado] = useState<ResultadoAviso | null>(null);
  const [programando, setProgramando] = useState(false);
  // Sin preferencia guardada (nunca lo activó ni lo quitó), el aviso se activa solo una vez.
  const autoActivar = useRef(false);
  const [leido, setLeido] = useState(false);

  useEffect(() => {
    leerPreferencia(CLAVE).then((texto) => {
      autoActivar.current = texto === null;
      setLeido(true);
      try {
        const g: Guardado | null = texto ? JSON.parse(texto) : null;
        if (g?.codigo === codigo) setGuardado(g);
      } catch {
        // Sin aviso guardado.
      }
    });
  }, [codigo]);

  const guardar = useCallback((g: Guardado | null) => {
    setGuardado(g);
    guardarPreferencia(CLAVE, g ? JSON.stringify(g) : '');
  }, []);

  const activar = useCallback(async () => {
    if (!llegada) return;
    setProgramando(true);
    const r = await programarAviso(llegada, codigo);
    setProgramando(false);
    setResultado(r.resultado);
    if (r.resultado === 'programado' || r.resultado === 'solo-en-app') guardar({ codigo, llegada: llegada.toISOString(), id: r.id });
  }, [llegada, codigo, guardar]);

  const desactivar = useCallback(async () => {
    await cancelarAviso(guardado?.id ?? null);
    setResultado(null);
    guardar(null);
  }, [guardado, guardar]);

  useEffect(() => {
    if (!leido || !autoActivar.current || !pendiente || !llegada) return;
    autoActivar.current = false;
    activar();
  }, [leido, pendiente, llegada, activar]);

  // Reprograma si cambió la estimación; lo cancela si el pedido ya se resolvió.
  const llegadaMs = llegada?.getTime() ?? null;
  useEffect(() => {
    const g = guardado;
    if (!g || llegadaMs === null) return;
    if (!pendiente) {
      cancelarAviso(g.id);
      return;
    }
    if (Math.abs(new Date(g.llegada).getTime() - llegadaMs) < TOLERANCIA_MS) return;
    cancelarAviso(g.id).then(async () => {
      const r = await programarAviso(new Date(llegadaMs), codigo);
      guardar({ codigo, llegada: new Date(llegadaMs).toISOString(), id: r.id });
    });
  }, [guardado, llegadaMs, pendiente, codigo, guardar]);

  return { activo: !!guardado, resultado, programando, activar, desactivar };
}
