import an from '../obrazky/an.png';
import azero from '../obrazky/azero.png';
import bn from '../obrazky/bn.png';
import fr from '../obrazky/fr.png';
import operace from '../obrazky/operace.png';

export const Teorie = () => {
  return (
    <div>
      <div className="text-div">
        <div>
          <h3>Operace se sginály:</h3>
          <p>
            <p>Kombinace singálových operací je dána vzorcem:</p>
            <img
              src={operace}
              alt="signalove operace"
              height="auto"
              width="85%"
            />
          </p>
          <p>m - měřítko</p>
          <p>a - zesílení</p>
          <p>τ - posunutí</p>
          <p>t - čas</p>
          <p>s(t) - původní neupravený signál</p>
          <p>p(t) - výsledný signál</p>
        </div>
        <div>
          <h3>Fourierova řada:</h3>
          <p>
            <p>Fourierova řada je dána vzorcem:</p>
            <img
              src={fr}
              alt="fourierova rada"
              height="auto"
              width="90%"
              max-width="100%"
            />
            <p>Jednotlivé koeficient jsou dány rovnicemi:</p>
            <p>
              <img
                src={azero}
                alt="a_0 koeficient"
                height="70px"
                width="auto"
              />
            </p>
            <p>
              <img src={an} alt="a_n koeficienty" height="70px" width="auto" />
            </p>
            <p>
              <img src={bn} alt="b_n koeficienty" height="70px" width="auto" />
            </p>
          </p>
        </div>
        <div>
          <h3>Teorie:</h3>
          <p>
            Výpočet Fourierovy řady umožňuje aproximovat periodické funkce jako
            součet harmonických funkcí sinus a kosinus. Jednotlivé sinusové
            složky reprezentují koeficienty a{'\u2099'} a kosinové b{'\u2099'}.
            Index označený jako n reprezentuje množinu přirozených čísel a nuly.
            Využití Fourierovy řady nalézáme např. v akustice a elektrotechnice.
            Hodnota koeficientu a{'\u2080'} je shodná se střední hodnotou
            signálu. Na hodnotu lze také nahlížet jako na kosinový signál s
            nulovou frekvencí (tedy jako na konstantu). V rámci výpočtu
            Fourierovy řady není uvažován žádný koeficient b{'\u2080'}, neboť by
            se jednalo o sinusový signál s nulovou frekvencí, tedy hodnota
            tohoto koeficientu by byla vždy nulová. Pro získání periody v
            procentech je τ násobeno (T/100).
          </p>
          <h3>Více informací:</h3>
          <p>
            <a
              href="https://cs.wikipedia.org/wiki/Fourierova_%C5%99ada"
              target="_blank"
              rel="noreferrer"
            >
              Fourierova řada
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
