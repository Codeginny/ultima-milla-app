import { View } from 'react-native';
import Svg, { Circle, Defs, G, Line, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { marca } from '@/tema';

// Ilustraciones de la bienvenida, dibujadas con formas simples en los colores de la marca.
export type Escena = 'reparto' | 'chofer' | 'cliente';

const G0 = marca.grafito;
const L = marca.lima;
const GRIS = '#3a403c';
const CLARO = '#eef2ea';

function Brillo() {
  return (
    <Defs>
      <RadialGradient id="luz" cx="160" cy="150" r="150" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor={L} stopOpacity={0.28} />
        <Stop offset="1" stopColor={L} stopOpacity={0} />
      </RadialGradient>
    </Defs>
  );
}

function Reparto() {
  return (
    <G>
      {/* depósito */}
      <Rect x={22} y={176} width={70} height={52} rx={10} fill={GRIS} />
      <Path d="M22 186l35-22 35 22" fill="none" stroke={CLARO} strokeWidth={4} strokeLinejoin="round" />
      <Rect x={44} y={200} width={26} height={28} rx={4} fill={G0} />
      {/* ruta punteada con paradas */}
      <Path d="M92 200 C140 200 120 120 170 120 S230 70 268 66" fill="none" stroke={L} strokeWidth={5} strokeDasharray="2 12" strokeLinecap="round" />
      <Circle cx={170} cy={120} r={11} fill={G0} stroke={L} strokeWidth={4} />
      <Circle cx={222} cy={86} r={11} fill={G0} stroke={L} strokeWidth={4} />
      {/* comercio de destino con pin */}
      <Rect x={246} y={96} width={60} height={44} rx={8} fill={GRIS} />
      <Path d="M242 100h68l-8-16h-52z" fill={CLARO} />
      <Path d="M268 30c-13 0-22 9-22 21 0 16 22 34 22 34s22-18 22-34c0-12-9-21-22-21z" fill={L} />
      <Circle cx={268} cy={51} r={8} fill={G0} />
    </G>
  );
}

function Chofer() {
  return (
    <G>
      {/* teléfono con la lista de paradas */}
      <Rect x={96} y={22} width={128} height={226} rx={24} fill={GRIS} />
      <Rect x={106} y={40} width={108} height={196} rx={14} fill={G0} />
      {[0, 1, 2, 3].map((i) => (
        <G key={i}>
          <Rect x={116} y={56 + i * 44} width={88} height={34} rx={10} fill={i === 1 ? L : '#1d211e'} opacity={i === 1 ? 1 : 0.9} />
          <Circle cx={132} cy={73 + i * 44} r={8} fill={i === 0 ? L : i === 1 ? G0 : '#3a403c'} />
          {i === 0 && <Path d="M128 73l3 3 6-6" fill="none" stroke={G0} strokeWidth={2.5} strokeLinecap="round" />}
          <Line x1={146} y1={69 + i * 44} x2={190} y2={69 + i * 44} stroke={i === 1 ? G0 : '#5b615d'} strokeWidth={4} strokeLinecap="round" />
          <Line x1={146} y1={79 + i * 44} x2={176} y2={79 + i * 44} stroke={i === 1 ? G0 : '#3a403c'} strokeWidth={4} strokeLinecap="round" />
        </G>
      ))}
      {/* tilde grande de "entregado" */}
      <Circle cx={244} cy={196} r={34} fill={L} />
      <Path d="M228 196l11 11 21-22" fill="none" stroke={G0} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      {/* firma */}
      <Path d="M40 214c14-18 22 6 34-10s14 8 26-2" fill="none" stroke={CLARO} strokeWidth={4} strokeLinecap="round" />
      <Line x1={36} y1={228} x2={104} y2={228} stroke="#5b615d" strokeWidth={3} />
    </G>
  );
}

function Cliente() {
  return (
    <G>
      {/* anillo de cuenta regresiva */}
      <Circle cx={160} cy={128} r={78} fill="none" stroke="#1d211e" strokeWidth={14} />
      <Path d="M160 50 A78 78 0 0 1 234 104" fill="none" stroke={L} strokeWidth={14} strokeLinecap="round" />
      <SvgText x={160} y={128} fontSize={44} fontWeight="700" fill={CLARO} textAnchor="middle">
        10
      </SvgText>
      <SvgText x={160} y={156} fontSize={16} fill="#9ba39d" textAnchor="middle">
        minutos
      </SvgText>
      {/* campana de aviso */}
      <Circle cx={252} cy={52} r={26} fill={L} />
      <Path d="M242 60h20l-3-5v-8a7 7 0 0 0-14 0v8z" fill={G0} />
      <Circle cx={252} cy={64} r={3} fill={G0} />
      {/* camión acercándose */}
      <Rect x={38} y={208} width={46} height={26} rx={6} fill={CLARO} />
      <Path d="M84 214h14l8 10v10H84z" fill={CLARO} />
      <Circle cx={52} cy={238} r={7} fill={L} />
      <Circle cx={94} cy={238} r={7} fill={L} />
      <Line x1={14} y1={216} x2={30} y2={216} stroke={L} strokeWidth={4} strokeLinecap="round" />
      <Line x1={20} y1={228} x2={32} y2={228} stroke={L} strokeWidth={4} strokeLinecap="round" />
    </G>
  );
}

export function Ilustracion({ escena }: { escena: Escena }) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden>
      <Svg width="100%" height={230} viewBox="0 0 320 260">
      <Brillo />
      <Rect width={320} height={260} rx={28} fill={G0} />
      <Rect width={320} height={260} rx={28} fill="url(#luz)" />
      {escena === 'reparto' && <Reparto />}
      {escena === 'chofer' && <Chofer />}
      {escena === 'cliente' && <Cliente />}
      </Svg>
    </View>
  );
}
