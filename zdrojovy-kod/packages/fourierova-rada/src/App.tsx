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
} from 'chart.js';
import { useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';

import './App.css';

import {
  Koeficienty,
  namapujVstupNaFourierRovnici,
  PERIODA_PRO_VYPOCET,
} from './knihovna/fourier';
import { namapujVstupNaRovnici } from './knihovna/rovnice';
import { mapaTlacitek, Rovnice } from './knihovna/utility';
import { Teorie } from './komponenty/Teorie';
import ZmenaHodnoty from './komponenty/ZmenaHodnoty';

// Registrace featur knihovny ChartJS nutna pro staticky build
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
);

export type Signaly = {
  proVykresleni: number[];
  proVypocet: number[];
};

export default function App() {
  //pocet zobrazenych koeficientu Fourierovy rady
  const NUM_COEFFICIENTS = 30;
  const poleKoeficientu = Array.from(Array(NUM_COEFFICIENTS).keys());

  const [perioda, nastavPeriodu] = useState(250);
  const [amplituda, nastavAmplitudu] = useState(500);

  const rozliseni = Array.from(Array(1000).keys());
  const [posun, nastavPosun] = useState(0);

  const [meritko, nastavMeritko] = useState(1);

  const [rovnice, nastavRovnici] = useState('sinus');
  const rozsah = { min: 0, max: 1000 };

  const vstupniSignal = namapujVstupNaRovnici(rovnice)(
    rozliseni,
    amplituda,
    PERIODA_PRO_VYPOCET,
    posun * 0.01 * perioda,
  );

  const Koeficienty: Koeficienty = namapujVstupNaFourierRovnici(rovnice)(
    poleKoeficientu,
    2 * amplituda,
    posun,
    perioda,
  );

  const zpracujZmenuRovnice = (nazev: string) => {
    nastavRovnici(nazev);
  };

  const zpracujZmenuPeriody = (T: string) => {
    const novaPerioda = Number.parseInt(T);
    nastavPeriodu(novaPerioda);
    const noveMeritko = (perioda * meritko) / novaPerioda;
    nastavMeritko(noveMeritko < 10 ? (noveMeritko > 1 ? noveMeritko : 1) : 10);
  };

  const zpracujZmenuAmplitudy = (A: string) => {
    const novaAmplituda = Number.parseFloat(A);
    nastavAmplitudu(novaAmplituda);
  };

  const zpracujZmenuPosunu = (p: string) => {
    const novyPosun = Number.parseFloat(p);
    nastavPosun(novyPosun);
  };

  const zpracujZmenuMeritka = (T: string) => {
    const noveMeritko = Number.parseFloat(T);
    nastavMeritko(noveMeritko);
    const novaPerioda = (meritko * perioda) / noveMeritko;
    nastavPeriodu(novaPerioda > 10 ? novaPerioda : 10);
  };

  // data pro graf puvodniho signalu
  const data = {
    labels: rozliseni,
    datasets: [
      {
        type: 'line' as const,
        data: vstupniSignal.map((x) => x / 1000),
        borderColor: 'black',
        backgroundColor: 'black',
        borderWidth: 2,
        label: 'p(t)',
      },
    ],
  };

  //data pro graf Fourierovy rady
  const dataFR = {
    labels: poleKoeficientu,
    datasets: [
      {
        type: 'bar' as const,
        label: `a${'\u2099'}`,
        backgroundColor: '#00a3a9',
        data: Koeficienty.a.map((x) => x / 1000),
        borderColor: '#00a3a9',
        borderWidth: 2,
      },
      {
        type: 'bar' as const,
        label: `b${'\u2099'}`,
        backgroundColor: '#200d5f',
        data: Koeficienty.b.map((x) => x / 1000),
        borderColor: '#200d5f',
        borderWidth: 2,
      },
    ],
  };

  const chartFRRef = useRef<ChartJS>(null);

  const options = {
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      y: {
        min: -1,
        max: 1,
      },
      x: {
        min: rozsah.min,
        max: rozsah.max,
        title: {
          display: true,
          text: 't',
          font: {
            size: 22,
          },
          color: 'black',
        },
      },
    },
    animation: {
      duration: 0,
    },
  };

  return (
    <div>
      <h1>Fourierova řada v goniometrickém tvaru</h1>
      <div className="chart-div">
        <Chart
          width="50%"
          height="10%"
          //ref={chartRef}
          type="line"
          data={data}
          options={options}
        />
        <Chart
          width="50%"
          height="10%"
          ref={chartFRRef}
          type="bar"
          data={dataFR}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'n',
                  font: {
                    size: 22,
                  },
                  color: 'black',
                },
              },
            },
          }}
        />
      </div>
      <div className="btn-div">
        {Rovnice.map((eq) => (
          <button
            key={eq}
            className="btn"
            style={{
              backgroundColor: eq === rovnice ? '#8790e3' : '#bcc1ea',
            }}
            onClick={(e) => zpracujZmenuRovnice(e.currentTarget.value)}
            value={eq}
          >
            {mapaTlacitek[eq]}
          </button>
        ))}
      </div>
      <div className="theory-div">
        <div>
          <h3>Posun: {posun}% periody</h3>
          <ZmenaHodnoty
            hodnota={posun}
            zpracujZmenuHodnoty={zpracujZmenuPosunu}
            className="slider-green"
            max={100}
            min={-100}
            step={1}
          />
          <h3>Zesílení: {amplituda / 1000}</h3>
          <input
            type="range"
            className="slider-red"
            value={amplituda}
            min="-1000"
            max="1000"
            step="10"
            onChange={(e) => zpracujZmenuAmplitudy(e.currentTarget.value)}
          ></input>
        </div>
        <div>
          <h3>Perioda (T): {Math.round(perioda)}</h3>
          <input
            type="range"
            value={perioda}
            min="10"
            max="1000"
            step="1"
            onChange={(e) => zpracujZmenuPeriody(e.currentTarget.value)}
          ></input>
          <h3>Měřítko: {meritko.toFixed(1)}</h3>
          <input
            type="range"
            value={meritko}
            className="slider-blue"
            min="1"
            step="0.1"
            max="10"
            color="pink"
            onChange={(e) => zpracujZmenuMeritka(e.currentTarget.value)}
          ></input>
        </div>
      </div>
      <Teorie />
      <div className="description-div">
        <p style={{ fontSize: '13px' }}>
          Applet interaktivní metodou znázorňuje Fourierovu řadu pro různé typy
          signálu (sinus, obdélník s různými střídami, pila a trojúhelník). Nad
          signály je dále možné provádět různé operace a pozorovat jejich vliv
          na Foruierovu řadu.
        </p>
        <p style={{ fontSize: '13px' }}>
          Signál lze vybrat pomocí klinutí myší na některé z tlačítek pod
          zobrazeným grafem. Pomocí posuvníků lze měnit některé parametry grafu
          - zesílení, periodu, měřítko a posun.
        </p>
        <hr style={{ width: '100%' }} />
        <p style={{ fontSize: '13px' }}>
          © 2023 Dominik Kuře, Pavel Rajmic, Vysoké učení technické v Brně
        </p>
      </div>
    </div>
  );
}
