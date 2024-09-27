// Pomery urcujici stridu obdelnika
const OBDELNIK_1 = 1 / 2
const OBDELNIK_2 = 2 / 3
const OBDELNIK_3 = 3 / 4

/**
 * @param arr - vstupni signal
 * @param A - maximum signalu
 * @param T - perioda
 * @param p - posun (v sekundach)
 * @param d - strida (duty cycle)
 */

export const sinusRovnice = (arr: number[], A: number, T: number, p: number) =>
  arr.map((x) => Math.sin((2 * Math.PI * x) / T + (2 * Math.PI * p) / T) * A)

const obdelnikRovnice =
  (d: number) => (arr: number[], A: number, T: number, p: number) =>
    arr.map((x) => (((((x + p + (T * d) / 2) % T) + T) % T) / T > d ? -A : A))

const trojuhelnikRovnice = (arr: number[], A: number, T: number, p: number) =>
  arr.map(
    (x) =>
      ((4 * A) / T) *
        Math.abs(((((x - (T - p * 4) / 4) % T) + T) % T) - T / 2) -
      A,
  )

const pilaRovnice = (arr: number[], A: number, T: number, p: number) =>
  arr.map((x) => 2 * A * ((x + p) / T - Math.floor(1 / 2 + (x + p) / T)))

export const namapujVstupNaRovnici = (input: string) => {
  switch (input) {
    case 'sinus':
      return sinusRovnice
    case 'obdelnik':
      return obdelnikRovnice(OBDELNIK_1)
    case 'obdelnik2':
      return obdelnikRovnice(OBDELNIK_2)
    case 'obdelnik3':
      return obdelnikRovnice(OBDELNIK_3)
    case 'trojuhelnik':
      return trojuhelnikRovnice
    case 'pila':
      return pilaRovnice
    default:
      return sinusRovnice
  }
}
