import { StyleSheet } from 'react-native';

import { espacio, fuentes, radio, sombra, Tema } from '@/tema';

const MARCADOR = 26;
const MARCADOR_GRANDE = 34;
const CAMION = 36;

export const crearEstilos = (tema: Tema) => {
  const { colores } = tema;
  return StyleSheet.create({
    marco: {
      alignSelf: 'stretch',
      borderRadius: radio.tarjeta,
      overflow: 'hidden',
      backgroundColor: colores.superficieTenue,
      ...sombra(tema, 1),
    },
    mosaico: { position: 'absolute' },
    // En modo oscuro el mapa se oscurece para que la ruta en lima resalte como una línea de luz.
    velo: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: colores.veloMapa },
    capa: { position: 'absolute', left: 0, top: 0 },
    marcador: {
      position: 'absolute',
      width: MARCADOR,
      height: MARCADOR,
      marginLeft: -MARCADOR / 2,
      marginTop: -MARCADOR / 2,
      borderRadius: MARCADOR / 2,
      borderWidth: 2,
      borderColor: colores.texto,
      alignItems: 'center',
      justifyContent: 'center',
    },
    marcadorGrande: {
      width: MARCADOR_GRANDE,
      height: MARCADOR_GRANDE,
      marginLeft: -MARCADOR_GRANDE / 2,
      marginTop: -MARCADOR_GRANDE / 2,
      borderRadius: MARCADOR_GRANDE / 2,
      borderWidth: 3,
      borderColor: colores.sobreAcento,
    },
    numero: { fontFamily: fuentes.negrita, fontSize: 12 },
    camion: {
      position: 'absolute',
      width: CAMION,
      height: CAMION,
      marginLeft: -CAMION / 2,
      marginTop: -CAMION / 2,
      borderRadius: CAMION / 2,
      backgroundColor: colores.insignia,
      borderWidth: 3,
      borderColor: colores.sobreInsignia,
      alignItems: 'center',
      justifyContent: 'center',
      ...sombra(tema, 2),
    },
    zoom: { position: 'absolute', right: espacio.s, top: espacio.s, gap: espacio.xs },
    botonZoom: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colores.superficie,
      alignItems: 'center',
      justifyContent: 'center',
      ...sombra(tema, 1),
    },
    atribucion: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: 10,
      color: '#0b1640',
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderTopLeftRadius: 6,
    },
  });
};
