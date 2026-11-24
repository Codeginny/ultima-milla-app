// Marca Última Milla: grafito casi negro y un único acento lima neón (kit en referencias-diseno/identidades/ultima-milla).
export const marca = {
  grafito: '#0b0d0c',
  grafitoClaro: '#151816',
  lima: '#c6f432',
  limaProfunda: '#4f6b00',
  coral: '#ff5c39',
  blanco: '#ffffff',
} as const;

export type Colores = {
  fondo: string;
  superficie: string;
  superficieTenue: string;
  texto: string;
  textoSuave: string;
  titulo: string;
  borde: string;
  // Borde de campos y casillas: 3:1 contra la superficie (WCAG 1.4.11).
  bordeControl: string;
  enlace: string;
  foco: string;
  primario: string;
  sobrePrimario: string;
  secundario: string;
  sobreSecundario: string;
  acento: string;
  sobreAcento: string;
  encabezado: string;
  sobreEncabezado: string;
  insignia: string;
  sobreInsignia: string;
  barra: string;
  sobreBarra: string;
  recorrido: string;
  recorridoHecho: string;
  veloMapa: string;
  velo: string;
  esqueleto: string;
  sombra: string;
  error: string;
  fondoError: string;
  exito: string;
  fondoExito: string;
  advertencia: string;
};

export const coloresClaros: Colores = {
  fondo: '#f2f3f5',
  superficie: '#ffffff',
  superficieTenue: '#e8eaed',
  texto: marca.grafito,
  textoSuave: '#5b615d',
  titulo: marca.grafito,
  borde: '#d9dce0',
  bordeControl: '#878e89',
  enlace: marca.limaProfunda,
  foco: '#9bc70e',
  primario: marca.grafito,
  sobrePrimario: marca.lima,
  secundario: '#e8eaed',
  sobreSecundario: marca.grafito,
  acento: marca.lima,
  sobreAcento: marca.grafito,
  encabezado: marca.grafito,
  sobreEncabezado: '#f4f7ee',
  insignia: marca.lima,
  sobreInsignia: marca.grafito,
  barra: marca.grafito,
  sobreBarra: '#a3aaa5',
  recorrido: marca.grafito,
  recorridoHecho: '#6b726d',
  veloMapa: 'rgba(242, 243, 245, 0.15)',
  velo: 'rgba(11, 13, 12, 0.6)',
  esqueleto: '#e1e4e7',
  sombra: marca.grafito,
  error: '#d92d1e',
  fondoError: '#fde8e5',
  exito: '#3f7d00',
  fondoExito: '#eef9d2',
  advertencia: marca.lima,
};

export const coloresOscuros: Colores = {
  fondo: '#070807',
  superficie: marca.grafitoClaro,
  superficieTenue: '#1d211e',
  texto: '#eef2ea',
  textoSuave: '#9ba39d',
  titulo: marca.blanco,
  borde: '#272c28',
  bordeControl: '#7a827c',
  enlace: marca.lima,
  foco: marca.lima,
  primario: marca.lima,
  sobrePrimario: marca.grafito,
  secundario: '#1d211e',
  sobreSecundario: '#eef2ea',
  acento: marca.lima,
  sobreAcento: marca.grafito,
  encabezado: '#070807',
  sobreEncabezado: marca.blanco,
  insignia: marca.lima,
  sobreInsignia: marca.grafito,
  barra: '#1d211e',
  sobreBarra: '#9ba39d',
  recorrido: marca.lima,
  recorridoHecho: '#6a726c',
  veloMapa: 'rgba(7, 8, 7, 0.55)',
  velo: 'rgba(0, 0, 0, 0.7)',
  esqueleto: '#1d211e',
  sombra: '#000000',
  error: '#ff6b5b',
  fondoError: '#3a1512',
  exito: marca.lima,
  fondoExito: '#222d0a',
  advertencia: marca.lima,
};
