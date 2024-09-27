export const Rovnice = [
  'sinus',
  'obdelnik',
  'obdelnik2',
  'obdelnik3',
  'trojuhelnik',
  'pila',
  'sum',
] as const

export const mapaTlacitek = {
  sinus: 'Sinus',
  obdelnik: 'Obdélník 1:1',
  obdelnik2: 'Obdélník 2:1',
  obdelnik3: 'Obdélník 3:1',
  trojuhelnik: 'Trojúhelník',
  pila: 'Pila',
  sum: 'Šum',
}

export const ziskejNahodneCeleCislo = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const vytvorPoleCelychCisel = (delka: number) =>
  Array.from(Array(delka).keys())
