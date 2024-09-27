import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  registerables,
  Tooltip,
} from 'chart.js'
import { useState } from 'react'
import { Chart } from 'react-chartjs-2'

import 'chartjs-plugin-dragdata'
import './App.css'

import {
  Bod,
  InterpolaceBezKubicke,
  namapujVstupNaInterpolaci,
  napmatujVstupNaKubickouInterpolaci,
  vychoziStavInterpolace,
  vychoziStavKubickeInterpolace,
} from './knihovna/interpolace'
import {
  mapaInterpolaceBarva,
  mapaInterpolaceNazev,
  mapaKubickaInterpolaceBarva,
  mapaKubickaInterpolaceNazev,
} from './knihovna/mapy'
import { vytvorPoleCelychCisel } from './knihovna/utility'
import Teorie from './komponenty/Teorie'

// Registrace featur knihovny ChartJS nutna pro staticky build
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  ...registerables,
)

// pole ktere definuje, kde se nachazi body
const poleOsyX = [50, 150, 250, 350, 450, 550, 650, 750, 850, 950]

const zaporneRozliseni = vytvorPoleCelychCisel(50)
  .map((x) => -x)
  .reverse()
  .slice(0, -1)

// vytvoreni pole reprezentujici graf
const maxRozliseni = zaporneRozliseni.concat(vytvorPoleCelychCisel(950))

export default function App() {
  const [napeti, nastavNapeti] = useState(0.3)

  // na zacatku jsou hodnoty bodu nastaveny nahodne
  const [vstupniSignal, nastavVstupniSignal] = useState(
    vytvorPoleCelychCisel(10).map((v, i) => ({
      x: i * 100,
      y: 2 * (Math.random() - 0.5),
    })),
  )

  const [interpolace, nastavInterpolace] = useState(vychoziStavInterpolace)
  const [kubickeInterpolace, nastavKubickeInterpolace] = useState(
    vychoziStavKubickeInterpolace,
  )

  // z hodnot v objektu reprezentujiciho stav interpolaci je vytvoreno pole
  const seznamInterpolaci = Object.entries(interpolace) as [
    keyof typeof interpolace,
    boolean,
  ][]

  const seznamKubickychInterpolaci = Object.entries(kubickeInterpolace) as [
    keyof typeof kubickeInterpolace,
    boolean,
  ][]

  // vola se rpi zakliknuti tlacitka "kubicka"
  const zpracujNastaveniKubickeInterpolace = () => {
    if (interpolace.kubicka) {
      nastavKubickeInterpolace((_) => ({ ...vychoziStavKubickeInterpolace }))
    }
    nastavInterpolace((i) => ({
      ...i,
      kubicka: !interpolace.kubicka,
    }))
  }

  // zde jsou vytvoreny jednotlive prubehy grafu
  const datasety = seznamInterpolaci
    //pouze aktivni
    .filter(([_, val]) => val)
    // jen nekubicke
    .filter(([interpolace, _]) => interpolace !== 'kubicka')
    .map(([interpolace, _]) => ({
      label: mapaInterpolaceNazev[interpolace],
      data: namapujVstupNaInterpolaci(
        interpolace as InterpolaceBezKubicke,
        vstupniSignal,
      ),
      dragData: false,
      radius: 0,
      borderColor: mapaInterpolaceBarva[interpolace],
      backgroundColor: mapaInterpolaceBarva[interpolace],
      borderWidth: 2,
    }))

  const kubickaDatasety = seznamKubickychInterpolaci
    .filter(([_, val]) => val)
    .map(([interpolace, _]) => ({
      label: mapaKubickaInterpolaceNazev[interpolace],
      data: napmatujVstupNaKubickouInterpolaci(
        interpolace,
        vstupniSignal,
        napeti,
      ),
      dragData: false,
      radius: 0,
      borderColor: mapaKubickaInterpolaceBarva[interpolace],
      backgroundColor: mapaKubickaInterpolaceBarva[interpolace],
      borderWidth: 2,
    }))

  // zde jsou vsechny prubehy interpolaci spojeny v seznam i s polem bodu
  const data = {
    labels: maxRozliseni,
    datasets: [
      {
        label: 'Vstupní data',
        backgroundColor: 'white',
        data: vstupniSignal,
        borderColor: 'black',
        borderWidth: 2,
        showLine: false,
        radius: 8,
      },
      ...datasety,
      ...kubickaDatasety,
    ],
  }

  const moznostiGrafu = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false,
      },
      // plugin pro moznost posouvani bodu
      dragData: {
        onDrag: (_: unknown, __: unknown, index: number, value: Bod) =>
          nastavVstupniSignal((signal) =>
            signal.map((v, i) => (i === index ? value : v)),
          ),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onHover: function (e: any) {
      const point = e.chart.getElementsAtEventForMode(
        e,
        'nearest',
        { intersect: true },
        false,
      )
      if (point.length) e.native.target.style.cursor = 'grab'
      else e.native.target.style.cursor = 'default'
    },
    scales: {
      y: {
        offset: 20,
        min: -1.2,
        max: 1.2,
        ticks: {
          stepSize: 0.1,
          font: {
            size: 18,
          },
          beginAtZero: true,
          color: 'black',
        },
        title: {
          display: true,
          text: 's(t)',
          font: {
            size: 22,
            style: 'italic',
          },
          color: 'black',
        },
      },
      x: {
        title: {
          display: true,
          text: 't',
          font: {
            size: 22,
            style: 'italic',
          },
          color: 'black',
        },
        ticks: {
          callback: (value: number, index: number) => {
            if (poleOsyX.includes(index)) return value - 50
          },
          color: 'black',
          font: {
            size: 18,
          },
        },
      },
    },
    animation: {
      duration: 1,
    },
  }

  return (
    <>
      <h1>Interpolace</h1>
      <div className="chart-div">
        <Chart
          data={data}
          type="line"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          options={moznostiGrafu}
          height="500px"
        />
      </div>
      <div className="btn-div">
        {seznamInterpolaci.map(([nazevInterpolace, jeZapnuta]) =>
          nazevInterpolace === 'kubicka' ? (
            <button
              className="btn"
              style={{
                // vizualni zaklikavani tlacitek
                backgroundColor: jeZapnuta ? '#B9B9B9' : '#F2F2F2',
                color: 'black',
              }}
              onClick={() => zpracujNastaveniKubickeInterpolace()}
            >
              {mapaInterpolaceNazev['kubicka']}
            </button>
          ) : (
            <button
              className="btn"
              style={{
                // vizualni zaklikavani tlacitek
                backgroundColor: jeZapnuta ? '#B9B9B9' : '#F2F2F2',
                color: 'black',
              }}
              onClick={() =>
                nastavInterpolace((soucasnyStav) => ({
                  ...soucasnyStav,
                  [nazevInterpolace]: !jeZapnuta,
                }))
              }
            >
              {mapaInterpolaceNazev[nazevInterpolace]}
            </button>
          ),
        )}
      </div>
      {interpolace.kubicka && (
        <div className="btn-div">
          {seznamKubickychInterpolaci.map(([nazevInterpolace, jeZapnuta]) => (
            <button
              className="btn"
              style={{
                backgroundColor: jeZapnuta ? '#B9B9B9' : '#F2F2F2',
                color: 'black',
              }}
              onClick={() =>
                nastavKubickeInterpolace((soucasnyStav) => ({
                  ...soucasnyStav,
                  [nazevInterpolace]: !jeZapnuta,
                }))
              }
            >
              {mapaKubickaInterpolaceNazev[nazevInterpolace]}
            </button>
          ))}
        </div>
      )}
      <div className="btn-div">
        <button
          className="btn-spec"
          style={{
            backgroundColor: 'teal',
            color: 'black',
          }}
          onClick={() =>
            nastavVstupniSignal(
              vytvorPoleCelychCisel(10).map((v, i) => ({
                x: i * 100,
                y: 0,
              })),
            )
          }
        >
          Vynuluj signál
        </button>
        <button
          className="btn-spec"
          style={{
            backgroundColor: 'teal',
            color: 'black',
          }}
          onClick={() =>
            nastavVstupniSignal(
              vytvorPoleCelychCisel(10).map((v, i) => ({
                x: i * 100,
                y: 2 * (Math.random() - 0.5),
              })),
            )
          }
        >
          Nastav náhodný signál
        </button>
      </div>
      {/* zobrazeni posuvniku pro kardinalni spline */}
      {kubickeInterpolace.kubickaKardinalniSplajn && (
        <div className="vert-div">
          Napětí kardinálního splajnu: {napeti}
          <div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={napeti}
              onChange={(e) => nastavNapeti(parseFloat(e.currentTarget.value))}
            ></input>
          </div>
        </div>
      )}
      <Teorie />
      <div className="description-div">
        <p style={{ fontSize: '13px' }}>
          Applet interaktivní metodou znázorňuje různé typy interpolací
          (lineární, nejbližší soused, sinus cardinalis a kubickou) pro daný
          počet bodů. Kubické interpolace je možné dosáhnout pomocí čtyř různých
          metod - kardinální splajn, Catmull-Rom splajn, přirozená a metodou
          konečných diferencí. Tyto metody se liší ve stanovení derivací a tedy
          sklonu okolo daných bodů.
        </p>
        <p style={{ fontSize: '13px' }}>
          Pomocí myši je možné posouvat body a tím měnit jejich hodnotu.
          Tlačítka pod grafem umožňují vypínat a zapínat jednotlivé interpolace
          a také nastavovat hodnoty bodů na náhodné hodnoty či nulu. Při výběru
          kubické interpolace metodou kardinálních splinů se objeví posuvník
          určující parametr napětí.
        </p>
        <hr style={{ width: '100%' }} />
        <p style={{ fontSize: '13px' }}>
          © 2023 Dominik Kuře, Pavel Rajmic, Vysoké učení technické v Brně
        </p>
      </div>
    </>
  )
}
