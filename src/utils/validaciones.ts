// Validaciones de formulario: devuelven el mensaje de error o null si está bien.
export function validarCorreo(correo: string): string | null {
  const limpio = correo.trim();
  if (!limpio) return 'Escribí tu correo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) return 'Revisá el correo: falta algo (por ejemplo, la @).';
  return null;
}
