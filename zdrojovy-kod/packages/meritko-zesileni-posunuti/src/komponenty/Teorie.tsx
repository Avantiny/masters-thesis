import operace from '../obrazky/operace.png'

export const Teorie = () => {
  return (
    <div>
      <h3>Informace:</h3>
      <div className="text-div">
        <div>
          <p>
            <p>Kombinace singálových operací je dána vzorcem:</p>
            <img
              src={operace}
              alt="signalove operace"
              height="auto"
              width="80%"
            />
          </p>
        </div>
        <div>
          <p>m - měřítko</p>
          <p>a - zesílení</p>
          <p>τ - posunutí</p>
          <p>t - čas</p>
          <p>s(t) - původní neupravený signál</p>
          <p>p(t) - výsledný signál</p>
        </div>
        <div>
          <p>
            Applet interaktivní metodou znázorňuje základní operace pro různé
            typy signálu (sinus, obdélník s různými střídami, pila a
            trojúhelník). Zvolením několika operací zároveň vzniká kombinace,
            jež je dána vzorcem vlevo. Pro získání periody v procentech je τ
            násobeno (T/100).
          </p>
          <p>
            Signál lze vybrat pomocí klinutí myší na některé z tlačítek pod
            zobrazeným grafem. Pomocí posuvníků lze měnit některé parametry
            grafu - zesílení, periodu, měřítko, velikost zobrazovaneho okna a
            posun.
          </p>
        </div>
      </div>
    </div>
  )
}
