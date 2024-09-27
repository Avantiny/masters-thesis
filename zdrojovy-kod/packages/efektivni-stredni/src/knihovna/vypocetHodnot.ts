import { TypRovnice } from './utility'

const integrate = (signal: number[]) => signal.reduce((acc, x) => acc + x, 0)

export const vypocitejEfektivniHodnotuSignalu = (signal: number[]) => {
  const signalUmocneny = signal.map((i) => i * i)
  return Math.sqrt((1 / signal.length) * integrate(signalUmocneny))
}

export const vypocitejStredniHodnotuSignalu = (signal: number[]) =>
  (1 / signal.length) * integrate(signal)

type VstupProHodnoty = {
  A: number
  typ: TypRovnice
  signal: number[]
}

export const vypocitejEfektivniHodnotu = ({
  A,
  typ,
  signal,
}: VstupProHodnoty) => {
  switch (typ) {
    case 'sinus':
      return A / Math.sqrt(2)
    case 'sum':
      return vypocitejEfektivniHodnotuSignalu(signal)
    case 'obdelnik':
      return A
    case 'obdelnik2':
      return A
    case 'obdelnik3':
      return A
    case 'trojuhelnik':
      return A / Math.sqrt(3)
    case 'pila':
      return A / Math.sqrt(3)
  }
}

export const vypocitejStredniHodnotu = ({
  A,
  typ,
  signal,
}: VstupProHodnoty) => {
  switch (typ) {
    case 'sinus':
      return 0
    case 'sum':
      return vypocitejStredniHodnotuSignalu(signal)
    case 'obdelnik':
      return 0
    case 'obdelnik2':
      return (1 / 3) * A
    case 'obdelnik3':
      return (1 / 2) * A
    case 'trojuhelnik':
      return 0
    case 'pila':
      return 0
  }
}
