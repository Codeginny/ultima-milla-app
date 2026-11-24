import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { MINUTOS_AVISO } from '@/utils/ruta';

// Aviso "tu pedido llega en 10 minutos": notificación local programada en el teléfono del cliente.
const CANAL = 'llegadas';

export type ResultadoAviso = 'programado' | 'sin-permiso' | 'muy-tarde' | 'solo-en-app';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
  });
}

async function pedirPermiso(): Promise<boolean> {
  const actual = await Notifications.getPermissionsAsync();
  if (actual.granted) return true;
  if (!actual.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

export async function cancelarAviso(id: string | null): Promise<void> {
  if (id && Platform.OS !== 'web') await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
}

/**
 * Programa la notificación para 10 minutos antes de la llegada estimada. En web no hay
 * notificaciones programadas: el aviso se muestra dentro de la app (lo resuelve la pantalla).
 */
export async function programarAviso(llegada: Date, codigoPedido: string): Promise<{ resultado: ResultadoAviso; id: string | null }> {
  const suenaEn = new Date(llegada.getTime() - MINUTOS_AVISO * 60_000);
  if (suenaEn.getTime() <= Date.now()) return { resultado: 'muy-tarde', id: null };
  if (Platform.OS === 'web') return { resultado: 'solo-en-app', id: null };
  if (!(await pedirPermiso())) return { resultado: 'sin-permiso', id: null };

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Llegada del pedido',
      importance: Notifications.AndroidImportance.HIGH,
    }).catch(() => {});
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Tu pedido llega en ${MINUTOS_AVISO} minutos`,
      body: `El pedido ${codigoPedido} está cerca. Tené a mano quién lo reciba.`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: suenaEn, channelId: CANAL },
  });
  return { resultado: 'programado', id };
}
