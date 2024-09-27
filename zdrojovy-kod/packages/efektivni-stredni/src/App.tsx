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

import { namapujVstupNaRovnici, sinusRovnice } from './knihovna/rovnice'
import { mapaTlacitek, Rovnice, TypRovnice } from './knihovna/utility'
import { moznostiGrafu } from './knihovna/utilityGraf'
import {
  vypocitejEfektivniHodnotu,
  vypocitejStredniHodnotu,
} from './knihovna/vypocetHodnot'
import Hodnoty from './komponenty/Hodnoty'
import Informace from './komponenty/Informace'
import { Vzorce } from './komponenty/Vzorce'
import ZmenaHodnoty from './komponenty/ZmenaHodnoty'

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
)

/*
 Vykresleny se signal neni stejny jako signal pouzivany ve vypoctech, nebot pro omezene okno
 jsou hodnoty efektivni a stredni hodnoty zkresleny, pokud je videt pouze cast periody.
 Na signal "vykresleny" ma vliv perioda, posunuti i zmena maxima, na "proVypocet" pouze maximum.
*/
type Signaly = {
  vykresleny: number[]
  proVypocet: number[]
}

// Hlavni komponenta aplikace
export default function App() {
  // Deklarace stavu
  const [perioda, nastavPeriodu] = useState(250)
  const [amplituda, nastavAmplitudu] = useState(1)
  const [posun, nastavPosun] = useState(0)
  const [rovnice, nastavRovnici] = useState<TypRovnice>('sinus')

  //Velikost zobrazovaneho okna na ose x
  const rozliseni = Array.from(Array(1000).keys())
  const [vstupniSignal, nastavVstupniSignal] = useState<Signaly>({
    vykresleny: sinusRovnice(rozliseni, amplituda, perioda, posun),
    proVypocet: sinusRovnice(rozliseni, amplituda, 250, 0),
  })

  //Blok funkci upravujici stav na zaklade vstupu uzivatele
  const zpracujZmenuRovnice = (nazev: TypRovnice) => {
    const rce = namapujVstupNaRovnici(nazev)
    nastavVstupniSignal({
      vykresleny: rce(rozliseni, amplituda, perioda, posun),
      proVypocet: rce(rozliseni, amplituda, 250, 0),
    })
    nastavRovnici(nazev)
  }

  const zpracujZmenuPeriody = (T: string) => {
    const novaPerioda = Number.parseInt(T)
    const rce = namapujVstupNaRovnici(rovnice)
    nastavPeriodu(novaPerioda)
    nastavVstupniSignal({
      vykresleny: rce(rozliseni, amplituda, novaPerioda, posun),
      proVypocet: rce(rozliseni, amplituda, 250, 0),
    })
  }

  const zpracujZmenuAmplitudy = (A: string) => {
    const novaAmplituda = Number.parseFloat(A)
    // Pro rovnici sumu chceme pri zmene velikosti zachovat signal, ktery by byl v tele bloku if pregenerovan
    if (rovnice !== 'sum') {
      const rce = namapujVstupNaRovnici(rovnice)
      nastavVstupniSignal({
        vykresleny: rce(rozliseni, novaAmplituda, perioda, posun),
        proVypocet: rce(rozliseni, novaAmplituda, 250, 0),
      })
    } else {
      nastavVstupniSignal({
        vykresleny: vstupniSignal.vykresleny.map(
          (x: number) => (x / amplituda) * novaAmplituda,
        ),
        proVypocet: vstupniSignal.proVypocet.map(
          (x: number) => (x / amplituda) * novaAmplituda,
        ),
      })
    }
    nastavAmplitudu(novaAmplituda)
  }

  const zpracujZmenuPosunu = (p: string) => {
    const novyPosun = Number.parseFloat(p)
    nastavPosun(novyPosun)
    const rce = namapujVstupNaRovnici(rovnice)
    nastavVstupniSignal({
      vykresleny: rce(rozliseni, amplituda, perioda, novyPosun),
      proVypocet: rce(rozliseni, amplituda, 250, 0),
    })
  }

  // Vraci datovou strukturu pro potrebne vypocty
  const vytvorVstupniHodnoty = () => ({
    A: amplituda,
    signal: vstupniSignal.proVypocet,
    typ: rovnice,
  })

  // Nastaveni grafu
  const data = {
    labels: rozliseni,
    datasets: [
      {
        type: 'line' as const,
        label: 'Efektivní hodnota',
        borderColor: 'green',
        backgroundColor: 'green',
        borderWidth: 4,
        fill: false,
        data: Array(rozliseni.length).fill(
          vypocitejEfektivniHodnotu(vytvorVstupniHodnoty()),
        ),
      },
      {
        type: 'line' as const,
        label: 'Střední hodnota',
        borderColor: 'red',
        backgroundColor: 'red',
        borderWidth: 4,
        fill: false,
        data: Array(rozliseni.length).fill(
          vypocitejStredniHodnotu(vytvorVstupniHodnoty()),
        ),
      },
      {
        type: 'line' as const,
        label: 'Vstupní signál',
        backgroundColor: 'blue',
        data: vstupniSignal.vykresleny,
        borderColor: 'blue',
        borderWidth: 2,
      },
    ],
  }

  // Reference na graf
  const chartRef = useRef<ChartJS>(null)

  return (
    <>
      <h1>Efektivní a střední hodnota</h1>
      <div className="chart-div">
        <Chart
          ref={chartRef}
          type="line"
          data={data}
          options={moznostiGrafu}
          height="100%"
        />
      </div>
      <h2>Zvolte signál:</h2>
      <div className="btn-div">
        {Rovnice.map((eq) => (
          <button
            className="btn"
            style={{
              backgroundColor: eq === rovnice ? '#c7bb98' : '#eae0c2',
            }}
            onClick={(e) =>
              zpracujZmenuRovnice(e.currentTarget.value as TypRovnice)
            }
            value={eq}
          >
            {mapaTlacitek[eq]}
          </button>
        ))}
      </div>
      <div className="theory-div">
        <div>
          {rovnice !== 'sum' && (
            <>
              <h3>Perioda: {perioda}</h3>
              <ZmenaHodnoty
                hodnota={perioda}
                zpracujZmenuHodnoty={zpracujZmenuPeriody}
                max={1000}
                min={5}
                step={1}
              />
            </>
          )}
          <h3>Zesílení: {amplituda.toFixed(2)}</h3>
          <ZmenaHodnoty
            hodnota={amplituda}
            zpracujZmenuHodnoty={zpracujZmenuAmplitudy}
            max={1}
            min={0.01}
            step={0.01}
          />
          {rovnice !== 'sum' && (
            <>
              <h3>Posun: {posun}</h3>
              <ZmenaHodnoty
                hodnota={posun}
                zpracujZmenuHodnoty={zpracujZmenuPosunu}
                max={perioda}
                min={0}
                step={1}
              />
            </>
          )}
        </div>
        <Hodnoty
          stredni={vypocitejStredniHodnotu(vytvorVstupniHodnoty())}
          efektivni={vypocitejEfektivniHodnotu(vytvorVstupniHodnoty())}
        />
        <Vzorce />
        <Informace />
      </div>
      <div className="description-div">
        <div>
          <h2>Popis appletu</h2>
          <p style={{ fontSize: '13px' }}>
            Applet interaktivní metodou znázorňuje střední a efektivní hodnotu
            pro různé druhy signálu (sinus, obdélník s různými střídami, pila,
            trojúhelník a šum). Tyto hodnoty jsou získány pomocí výše uvedených
            vzorců. Střední hodnota signálu se označuje jako stejnosměrná
            složka. Jde o průměrnou hodnotu funkce s časovým argumentem za dobu
            jedné periody. Efektivní hodnota proměnného periodického signálu je
            taková hodnota signálu stejnosměrného, který vykoná za stejný čas
            stejnou práci jako signál střídavý.
          </p>
          <p style={{ fontSize: '13px' }}>
            Signál lze vybrat pomocí klinutí myší na některé z tlačítek pod
            zobrazeným grafem. Pomocí posuvníků v levé části pod grafem lze
            měnit některé parametry grafu - zesílení, periodu a posun. Perioda a
            posun nemají na vypočítané hodnoty vliv, zesílení se však na těchto
            hodnotách projevuje. Při každém kliknutí na tlačítko šum je
            vygenerován nový signál a jeho vypočítané hodnoty se také změní.
          </p>
          <hr />
          <p style={{ fontSize: '13px' }}>
            © 2023 Dominik Kuře, Pavel Rajmic, Vysoké učení technické v Brně
          </p>
        </div>
      </div>
    </>
  )
}
