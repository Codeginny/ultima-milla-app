import { useEffect, useState } from 'react';

// Hora actual que se renueva sola: "llega en 8 min" baja sin recargar la pantalla.
export function useAhora(cadaMs = 30_000): Date {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), cadaMs);
    return () => clearInterval(intervalo);
  }, [cadaMs]);
  return ahora;
}
