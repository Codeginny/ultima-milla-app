import { Linking } from 'react-native';

import type { Coordenadas } from '@/tipos';

// Abre el mapa en la dirección de la parada para que el chofer siga la navegación.
export function comoLlegar({ latitud, longitud }: Coordenadas) {
  return Linking.openURL(`https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}#map=18/${latitud}/${longitud}`);
}
