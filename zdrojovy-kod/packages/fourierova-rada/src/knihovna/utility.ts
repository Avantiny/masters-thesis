// pole obsahujici vsechny druhy signalu
export const Rovnice = [
  'sinus',
  'obdelnik',
  'obdelnik2',
  'obdelnik3',
  'trojuhelnik',
  'pila',
] as const;

// mapa hodnoty na text tlacitka
export const mapaTlacitek = {
  sinus: 'Sinus',
  obdelnik: 'Obdélník 1:1',
  obdelnik2: 'Obdélník 2:1',
  obdelnik3: 'Obdélník 3:1',
  trojuhelnik: 'Trojúhelník',
  pila: 'Pila',
};

// funkce pro vypocet nahodneho cisla, jenz je vyuzita pri generaci sumoveho signalu
export const ziskejNahodneCeleCislo = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export type TypRovnice = typeof Rovnice[number];
