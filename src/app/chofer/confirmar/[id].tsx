import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Boton } from '@/componentes/Boton/Boton';
import { CampoTexto } from '@/componentes/CampoTexto/CampoTexto';
import { EstadoVacio } from '@/componentes/Estados/Estados';
import { FirmaPad } from '@/componentes/FirmaPad/FirmaPad';
import { Icono } from '@/componentes/Icono/Icono';
import { Pantalla, Seccion } from '@/componentes/Pantalla/Pantalla';
import { Tarjeta } from '@/componentes/Tarjeta/Tarjeta';
import { Texto } from '@/componentes/Texto/Texto';
import { useHaptica } from '@/hooks/useHaptica';
import { useJornada } from '@/hooks/useJornada';
import { useRuta } from '@/hooks/useRuta';
import { useTema } from '@/tema';

// Comprobante de entrega en 3 pasos: quién recibe, control de bultos y firma. El pie fijo dice cuál falta.
export default function ConfirmarEntrega() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { datos: ruta } = useRuta();
  const { marcarEntregada } = useJornada();
  const haptica = useHaptica();
  const { colores } = useTema();
  const parada = ruta?.paradas.find((p) => p.id === id);
  // Hasta que el chofer lo cambie, se propone el contacto del cliente (la ruta llega después del primer render).
  const [receptorEditado, setReceptor] = useState<string | null>(null);
  const receptor = receptorEditado ?? parada?.cliente.contacto ?? '';
  const [bultosOk, setBultosOk] = useState(false);
  const [firmada, setFirmada] = useState(false);

  if (!parada) {
    return (
      <Pantalla>
        <EstadoVacio icono="help-circle-outline" titulo="No encontramos esta parada" />
      </Pantalla>
    );
  }

  const pasos = [receptor.trim().length > 1, bultosOk, firmada];
  const hechos = pasos.filter(Boolean).length;
  const listo = hechos === pasos.length;
  const falta = [pasos[0] ? null : 'el nombre', pasos[1] ? null : 'el control de bultos', pasos[2] ? null : 'la firma'].filter(Boolean).join(', ');
  const titulo = (n: number, texto: string) => `${pasos[n - 1] ? '✓' : `${n}.`} ${texto}`;

  const confirmar = () => {
    marcarEntregada(parada.id, receptor.trim());
    haptica.exito();
    router.dismissTo('/chofer');
  };

  return (
    <Pantalla
      pie={
        <>
          <Texto variante="chico" centrado>
            {listo ? 'Todo listo: confirmá la entrega.' : `Paso ${hechos} de 3 · falta ${falta}.`}
          </Texto>
          <Boton variante="acento" texto="Confirmar entrega" icono="checkmark-circle" deshabilitado={!listo} onPress={confirmar} />
        </>
      }>
      <Tarjeta>
        <Texto variante="etiqueta">
          Parada {parada.orden} · Pedido {parada.pedido.codigo}
        </Texto>
        <Texto variante="subtitulo">{parada.cliente.nombre}</Texto>
        <Texto variante="chico">{parada.direccion}</Texto>
      </Tarjeta>

      <Seccion titulo={titulo(1, 'Quién recibe')}>
        <CampoTexto etiqueta="Nombre" valor={receptor} onCambiar={setReceptor} placeholder="Nombre de quien recibe" />
      </Seccion>

      <Seccion titulo={titulo(2, 'Control de bultos')}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: bultosOk }}
          onPress={() => {
            haptica.toque();
            setBultosOk((v) => !v);
          }}>
          <Tarjeta enFila>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: bultosOk ? colores.acento : colores.bordeControl,
                backgroundColor: bultosOk ? colores.acento : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {bultosOk && <Icono nombre="checkmark" tamano={18} color="sobreAcento" />}
            </View>
            <View style={{ flex: 1 }}>
              <Texto variante="destacado">Se entregaron los {parada.pedido.bultos} bultos</Texto>
              <Texto variante="chico">{parada.pedido.items.map((i) => `${i.cantidad} × ${i.producto}`).join(' · ')}</Texto>
            </View>
          </Tarjeta>
        </Pressable>
      </Seccion>

      <Seccion titulo={titulo(3, 'Firma')} descripcion="Pedile a quien recibe que firme en el recuadro.">
        <FirmaPad onCambiar={setFirmada} />
      </Seccion>
    </Pantalla>
  );
}
