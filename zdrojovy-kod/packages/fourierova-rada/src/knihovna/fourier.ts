import { Signaly } from '../App';
import { integrace } from './vypocetHodnot';

// Pomery urcujici stridu obdelnika
const OBDELNIK_1 = 1 / 2;
const OBDELNIK_2 = 2 / 3;
const OBDELNIK_3 = 3 / 4;

export const PERIODA_PRO_VYPOCET = 1000;

// predpokladam, ze v arr jsou body na jedne periode funkce
// max je pocet jednotek na x-ove ose v jedne periode
const ziskejKoeficientyA = (arr: number[], max: number, n: number) => {
  return (
    (2 / max) *
    integrace(arr.map((ft, t) => ft * Math.cos(n * ((2 * Math.PI) / max) * t)))
  );
};

const ziskejKoeficientyB = (arr: number[], max: number, n: number) => {
  return (
    (2 / max) *
    integrace(arr.map((ft, t) => ft * Math.sin(n * ((2 * Math.PI) / max) * t)))
  );
};

// Tyto dve funkce jiz nejsou vyuzivany, slouzi k vypoctu koeficientu pomoci integralu
export const aKoeficienty = (arrCoef: number[], arr: Signaly) =>
  arrCoef.map((n) =>
    ziskejKoeficientyA(
      arr.proVypocet.slice(0, PERIODA_PRO_VYPOCET),
      PERIODA_PRO_VYPOCET,
      n,
    ),
  );

export const bKoeficienty = (arrCoef: number[], arr: Signaly) =>
  arrCoef.map((n) =>
    ziskejKoeficientyB(
      arr.proVypocet.slice(0, PERIODA_PRO_VYPOCET),
      PERIODA_PRO_VYPOCET,
      n,
    ),
  );

const aplikujPosunutiNaPrvek = (
  a: number,
  b: number,
  p: number,
  w: number,
  n: number,
) => ({
  // minus v argumentech je protoze posun je realne na opacnou stranu
  a: a * Math.cos(-w * p * n) - b * Math.sin(-w * p * n),
  b: b * Math.cos(-w * p * n) + a * Math.sin(-w * p * n),
});

// aplikuje posunuti na cele pole koeficientu
const vypocitatPosunuti = (koef: Koeficienty, p: number, w: number) =>
  koef.a.reduce(
    (acc, _, i) => ({
      a: [...acc.a, aplikujPosunutiNaPrvek(koef.a[i], koef.b[i], p, w, i).a],
      b: [...acc.b, aplikujPosunutiNaPrvek(koef.a[i], koef.b[i], p, w, i).b],
    }),
    { a: [], b: [] } as Koeficienty,
  );

export type Koeficienty = {
  a: number[];
  b: number[];
};

const sinusFourierRovnice = (
  arr: number[],
  A: number,
  p: number,
  T: number,
): Koeficienty =>
  vypocitatPosunuti(
    {
      a: new Array(arr.length).fill(0),
      b: [0, A / 2, ...new Array(arr.length - 2).fill(0)],
    },
    (p / 100) * T,
    (2 * Math.PI) / T,
  );

const obdelnikFourierRovnice =
  (d: number) =>
  (arr: number[], A: number, p: number, T: number): Koeficienty =>
    vypocitatPosunuti(
      {
        b: new Array(arr.length).fill(0),
        a: arr.map((n, i) =>
          i === 0
            ? A * (2 * d - 1)
            : ((2 * A) / (n * Math.PI)) * Math.sin(n * Math.PI * d),
        ),
      },
      (p / 100) * T,
      (2 * Math.PI) / T,
    );

const trojuhelnikFourierRovnice = (
  arr: number[],
  A: number,
  p: number,
  T: number,
): Koeficienty =>
  vypocitatPosunuti(
    {
      b: new Array(arr.length).fill(0),
      a: arr.map(
        (n) =>
          (4 * (A / 2) * (1 - Math.pow(-1, n))) /
          (Math.pow(n, 2) * Math.pow(Math.PI, 2)),
      ),
    },
    (p / 100) * T - T / 4,
    (2 * Math.PI) / T,
  );

const pilaFourierRovnice = (
  arr: number[],
  A: number,
  p: number,
  T: number,
): Koeficienty =>
  vypocitatPosunuti(
    {
      b: arr.map((n) => -A / (n * Math.PI)),
      a: new Array(arr.length).fill(0),
    },
    (p / 100) * T - T / 2,
    (2 * Math.PI) / T,
  );

export const namapujVstupNaFourierRovnici = (input: string) => {
  switch (input) {
    case 'sinus':
      return sinusFourierRovnice;
    case 'obdelnik':
      return obdelnikFourierRovnice(OBDELNIK_1);
    case 'obdelnik2':
      return obdelnikFourierRovnice(OBDELNIK_2);
    case 'obdelnik3':
      return obdelnikFourierRovnice(OBDELNIK_3);
    case 'trojuhelnik':
      return trojuhelnikFourierRovnice;
    case 'pila':
      return pilaFourierRovnice;
    default:
      return sinusFourierRovnice;
  }
};
