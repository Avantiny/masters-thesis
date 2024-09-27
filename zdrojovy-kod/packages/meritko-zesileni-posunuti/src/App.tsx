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
import { useRef, useState } from 'react'
import { Chart } from 'react-chartjs-2'

import './App.css'

import { namapujVstupNaRovnici } from './knihovna/rovnice'
import { mapaTlacitek, Rovnice } from './knihovna/utility'
import { Teorie } from './komponenty/Teorie'
import ZmenaHodnoty from './komponenty/ZmenaHodnoty'

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineElement,
  PointElement,
  ...registerables,
)

const vytvorPoleCelychCisel = (delka: number) => Array.from(Array(delka).keys())

const MAXIMALNI_DELKA_GRAFU = 2500
export default function App() {
  //vytvoreni zaporne casti rozsahu grafu
  const maxRozliseniZaporne = vytvorPoleCelychCisel(MAXIMALNI_DELKA_GRAFU)
    .map((x) => -x)
    .reverse()
    .slice(0, -1)

  // vytvoreni rozsahu grafu
  const maxRozliseni = maxRozliseniZaporne.concat(
    vytvorPoleCelychCisel(MAXIMALNI_DELKA_GRAFU),
  )

  const [perioda, nastavPeriodu] = useState(250)
  const [amplituda, nastavAmplitudu] = useState(500)

  const [rozliseni, nastavRozliseni] = useState(1000)
  const [meritko, nastavMeritko] = useState(1)

  const [rovnice, nastavRovnici] = useState('sinus')
  const [rozsah, nastavRozsah] = useState({ min: -1000, max: 999 })
  const [posun, nastavPosun] = useState(0)

  const vstupniSignal = namapujVstupNaRovnici(rovnice)(
    maxRozliseni,
    amplituda,
    perioda,
    // posun je zadan v procentech periody
    posun * 0.01 * perioda,
  )

  const zpracujZmenuRovnice = (nazev: string) => {
    nastavRovnici(nazev)
  }

  const zpracujZmenuRozliseni = (res: string) => {
    const r = Number.parseInt(res)
    nastavRozliseni(r)
    nastavRozsah({
      max: Number.parseInt(res) - 1,
      min: -Number.parseInt(res),
    })
  }

  const zpracujZmenuPeriody = (T: string) => {
    const novaPerioda = Number.parseInt(T)
    nastavPeriodu(novaPerioda)
    const noveMeritko = (perioda * meritko) / novaPerioda
    // omezeni krajnich hodnot meritka
    nastavMeritko(noveMeritko < 10 ? (noveMeritko > 1 ? noveMeritko : 1) : 10)
  }

  const zpracujZmenuAmplitudy = (A: string) => {
    const novaAmplituda = Number.parseFloat(A)
    if (rovnice !== 'sum') {
      nastavAmplitudu(novaAmplituda)
    }
  }

  const zpracujZmenuMeritka = (T: string) => {
    const noveMeritko = Number.parseFloat(T)
    nastavMeritko(noveMeritko)
    const novaPerioda = (meritko * perioda) / noveMeritko
    // omezeni krajnich hodnot periody
    nastavPeriodu(novaPerioda > 10 ? novaPerioda : 10)
  }

  const zpracujZmenuPosunu = (p: string) => {
    const novyPosun = Number.parseFloat(p)
    nastavPosun(novyPosun)
  }

  const data = {
    labels: maxRozliseni,
    datasets: [
      {
        type: 'line' as const,
        backgroundColor: 'black',
        data: vstupniSignal.map((x) => x / 1000),
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  }

  // nastaveni grafu
  const moznostiGrafu = {
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      y: {
        min: -1,
        max: 1,
        ticks: {
          stepSize: 500,
          font: {
            size: 18,
          },
          color: 'black',
        },
        title: {
          display: true,
          text: 'p(t)',
          font: {
            size: 22,
            style: 'italic',
          },
          color: 'black',
        },
      },
      x: {
        min: rozsah.min,
        max: rozsah.max,
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
          autoskip: true,
          autoSkipPadding: 190,
          color: 'black',
          font: {
            size: 18,
          },
        },
      },
    },
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const chartRef = useRef<ChartJS>(null)

  return (
    <>
      <h1>Posunutí, zesílení a změna měřítka</h1>
      <div className="chart-div">
        <Chart
          ref={chartRef}
          type="line"
          data={data}
          options={moznostiGrafu}
          height="100%"
          margin-left={'40px'}
        />
      </div>
      <div className="btn-div">
        {Rovnice.map((eq) => (
          <button
            key={eq}
            className="btn"
            style={{
              backgroundColor: eq === rovnice ? '#ab7ec0' : '#c0a6cc',
            }}
            onClick={(e) => zpracujZmenuRovnice(e.currentTarget.value)}
            value={eq}
          >
            {mapaTlacitek[eq]}
          </button>
        ))}
      </div>

      <div>
        <br />
        <div className="theory-div">
          <div>
            <h3>Posun: {posun}% periody</h3>
            <p>
              <input
                type="range"
                className="slider-green"
                value={posun}
                max={100}
                min={-100}
                step="1"
                onChange={(e) => zpracujZmenuPosunu(e.currentTarget.value)}
              ></input>
            </p>
            <h3>Zesílení: {(amplituda / 1000).toFixed(2)}</h3>
            <p>
              <ZmenaHodnoty
                hodnota={amplituda}
                className="slider-red"
                zpracujZmenuHodnoty={zpracujZmenuAmplitudy}
                min={-1000}
              />
            </p>
          </div>

          <div>
            <h3>Perioda (T): {Math.round(perioda)}</h3>
            {rovnice !== 'sum' && (
              <ZmenaHodnoty
                hodnota={perioda}
                zpracujZmenuHodnoty={zpracujZmenuPeriody}
              />
            )}
            <h3>Měřítko: {meritko.toFixed(1)}</h3>
            <p>
              <input
                type="range"
                value={meritko}
                className="slider-blue"
                min="1"
                step="0.1"
                max="10"
                onChange={(e) => zpracujZmenuMeritka(e.currentTarget.value)}
              ></input>
            </p>
          </div>
          <div>
            <h3>Rozsah okna: {2 * rozliseni}</h3>
            <p>
              <input
                type="range"
                value={rozliseni}
                min="100"
                step="10"
                max="2500"
                onChange={(e) => zpracujZmenuRozliseni(e.currentTarget.value)}
              ></input>
            </p>
          </div>
        </div>
        <div>
          <Teorie />
        </div>
        <hr style={{ marginLeft: '7.5%', marginRight: '7.5%' }} />
        <p style={{ fontSize: '13px', color: '#e6e6e6', marginLeft: '7.5%' }}>
          © 2023 Dominik Kuře, Pavel Rajmic, Vysoké učení technické v Brně
        </p>
      </div>
    </>
  )
}
