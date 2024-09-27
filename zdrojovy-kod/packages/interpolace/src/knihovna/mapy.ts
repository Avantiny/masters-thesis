import { Interpolace, KubickaInterpolace } from './interpolace'

export const mapaKubickaInterpolaceNazev: Record<KubickaInterpolace, string> = {
  kubickaKardinalniSplajn: 'Kubická - kardinální splajn',
  kubickaKonecneDiference: 'Kubická - konečné diference',
  kubickaPrirozena: 'Kubická - přirozená',
  kubickaCatmullRomSplajn: 'Kubická - Catmull-Rom splajn',
}

export const mapaInterpolaceNazev: Record<Interpolace, string> = {
  kubicka: 'Kubická',
  sinc: 'Sinus Cardinalis',
  linearni: 'Lineární',
  nejblizsiSoused: 'Nejbližší soused',
}

export const mapaKubickaInterpolaceBarva: Record<KubickaInterpolace, string> = {
  kubickaKardinalniSplajn: 'purple',
  kubickaKonecneDiference: 'brown',
  kubickaPrirozena: 'green',
  kubickaCatmullRomSplajn: 'teal',
}

export const mapaInterpolaceBarva: Record<Interpolace, string> = {
  sinc: 'blue',
  linearni: 'red',
  nejblizsiSoused: 'magenta',
  kubicka: '',
}
