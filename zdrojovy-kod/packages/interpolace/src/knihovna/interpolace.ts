import { vytvorPoleCelychCisel } from './utility'

export const vychoziStavKubickeInterpolace = {
  kubickaPrirozena: false,
  kubickaKonecneDiference: false,
  kubickaKardinalniSplajn: false,
  kubickaCatmullRomSplajn: false,
}

export const vychoziStavInterpolace = {
  nejblizsiSoused: false,
  linearni: true,
  kubicka: false,
  sinc: false,
}

const POCET_BODU_MEZI_BODY = 100

export type Interpolace = keyof typeof vychoziStavInterpolace
export type InterpolaceBezKubicke = 'sinc' | 'nejblizsiSoused' | 'linearni'
export type KubickaInterpolace = keyof typeof vychoziStavKubickeInterpolace

export type Bod = { x: number; y: number }

const sinc = (x: number) => (x !== 0 ? Math.sin(x) / x : 1)

const vypocitejTangentu = (a: Bod, b: Bod) => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  if (dx === 0 || dy === 0) return 0
  return dy / dx
}

const vytvorTangentyKardinalniSplajn = (
  signal: Bod[],
  c: number,
): Record<number, number> => {
  const tangenty = {} as Record<number, number>
  for (let i = 1; i < signal.length - 1; i++) {
    const py = (1 - c) * vypocitejTangentu(signal[i + 1], signal[i - 1])
    tangenty[signal[i].x] = py
  }
  tangenty[signal[0].x] = (1 - c) * vypocitejTangentu(signal[0], signal[1])
  const d = signal.length - 1
  tangenty[signal[d].x] = (1 - c) * vypocitejTangentu(signal[d], signal[d - 1])
  return tangenty
}

const vytvorTangentyKonecneDiference = (
  signal: Bod[],
): Record<number, number> => {
  const tangenty = {} as Record<number, number>
  for (let i = 1; i < signal.length - 1; i++) {
    //x se ve vzroci podeli, vyjde 1/2 * (1 + 1)
    const py =
      (1 / 2) *
      (vypocitejTangentu(signal[i + 1], signal[i]) +
        vypocitejTangentu(signal[i], signal[i - 1]))
    tangenty[signal[i].x] = py
  }
  // okrajove podminky
  tangenty[signal[0].x] = vypocitejTangentu(signal[0], signal[1])
  const d = signal.length - 1
  tangenty[signal[d].x] = vypocitejTangentu(signal[d], signal[d - 1])
  return tangenty
}

export const napmatujVstupNaKubickouInterpolaci = (
  nazev: KubickaInterpolace,
  signal: Bod[],
  c: number,
) =>
  ({
    kubickaPrirozena: kubickaInterpolace(
      signal.reduce((akumulator, curr) => ({ ...akumulator, [curr.x]: 0 }), {}),
    ),
    kubickaKonecneDiference: kubickaInterpolace(
      vytvorTangentyKonecneDiference(signal),
    ),
    kubickaKardinalniSplajn: kubickaInterpolace(
      vytvorTangentyKardinalniSplajn(signal, c),
    ),
    kubickaCatmullRomSplajn: kubickaInterpolace(
      vytvorTangentyKardinalniSplajn(signal, 0.5),
    ),
  }[nazev](signal))

export const namapujVstupNaInterpolaci = (
  nazev: InterpolaceBezKubicke,
  signal: Bod[],
) =>
  ({
    nejblizsiSoused: nejblizsiSousedInterpolace,
    linearni: linearniInterpolace,
    sinc: sincInterpolace,
  }[nazev](signal))

const nejblizsiSousedInterpolace = (signal: Bod[]) =>
  vyresInterpolaci(signal, (a, b, x) => (x < (a.x + b.x) / 2 ? a.y : b.y))

const linearniInterpolace = (signal: Bod[]) =>
  vyresInterpolaci(
    signal,
    (a, b, x) => a.y + ((x - a.x) * (b.y - a.y)) / (b.x - a.x),
  )
const kubickaInterpolace =
  (tangenty: Record<number, number>) => (signal: Bod[]) =>
    vyresInterpolaci(signal, (a, b, x) => {
      const k1 = tangenty[a.x]
      const k2 = tangenty[b.x]
      const t = (x - a.x) / (b.x - a.x)
      const A = k1 * (b.x - a.x) - (b.y - a.y)
      const B = -k2 * (b.x - a.x) + b.y - a.y

      return (1 - t) * a.y + t * b.y + t * (1 - t) * (A * (1 - t) + B * t)
    })

const sincInterpolace = (signal: Bod[]) => {
  const poleNulovychHodnot = vytvorPoleCelychCisel(
    POCET_BODU_MEZI_BODY * (signal.length - 1),
  ).map((_, i) => ({ x: i, y: 0 }))
  return signal.reduce(
    (akumulator, aktualniBod) =>
      akumulator.map((b) => ({
        x: b.x,
        y:
          b.y +
          aktualniBod.y *
            sinc((Math.PI / POCET_BODU_MEZI_BODY) * (b.x - aktualniBod.x)),
      })),
    poleNulovychHodnot,
  )
}

const vyresInterpolaci = (
  signal: Bod[],
  interpolacniFunkce: (a: Bod, b: Bod, x: number) => number,
) =>
  signal.slice(1).reduce(
    ([predchoziBod, akumulator], aktualniBod) => {
      const noveBody = vytvorPoleCelychCisel(POCET_BODU_MEZI_BODY)
        // [0,1,2,3...,99]
        .map((i) => predchoziBod.x + i)
        // pokud je predchozi bod 100 -> [100,101,102,...,199]
        .map((x) => ({
          x,
          y: interpolacniFunkce(predchoziBod, aktualniBod, x),
        }))
      // pole vyslednych bodu

      return [aktualniBod, [...akumulator, ...noveBody]] as const
    },
    [signal[0], [] as readonly Bod[]] as const,
  )[1]
