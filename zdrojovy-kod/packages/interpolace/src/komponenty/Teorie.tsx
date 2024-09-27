import catmull from '../obrazky/catmull.png'
import kardinalni from '../obrazky/kardinalni.png'
import konecne from '../obrazky/konecne.png'
import prirozena from '../obrazky/prirozena.png'

const Teorie = () => {
  return (
    <div className="text-div">
      <h3>Metody interpolace:</h3>
      <p>
        Nejbližší soused: na základě podmínky dochází ke zjištění, zdali se
        aktuální hodnota osy x nachází v první nebo druhé polovině intervalu
        mezi dvěma sousedními body, viz{' '}
        <a
          href="https://en.wikipedia.org/wiki/Nearest-neighbor_interpolation"
          target="_blank"
          rel="noreferrer"
        >
          interpolace metodou nejbližšího souseda
        </a>{' '}
        (v angličině).
      </p>
      <p>
        Lineární: interpolace je realizována jako přímka mezi dvěma body, viz{' '}
        <a
          href="https://cs.wikipedia.org/wiki/Line%C3%A1rn%C3%AD_interpolace"
          target="_blank"
          rel="noreferrer"
        >
          lineární interpolace
        </a>
        .
      </p>
      <p>
        Kubická: základní myšlenkou kubické interpolace je proložení každé
        mezery mezi dvěma sousedními body kubickým polynomem. U kubické
        interpolace je nutné zvolit některé podmínky, v této aplikaci jsou tyto
        podmínky realizovány pomocí výpočtu tangent (sklonu) okolo každého bodu.
        Většina metod používá k výpočtu tříbodové rozsahy, pro krajní body je
        tangenta vypočítána pouze z prvního a druhého (resp. posledního a
        předposledního) bodu. Více informací viz{' '}
        <a
          href="https://marast.fit.cvut.cz/cs/blog_posts/16"
          target="_blank"
          rel="noreferrer"
        >
          kubická interpolace
        </a>{' '}
        a{' '}
        <a
          href="https://en.wikipedia.org/wiki/Cubic_Hermite_spline"
          target="_blank"
          rel="noreferrer"
        >
          výpočet tangent
        </a>{' '}
        (v angličtině).
      </p>
      <p>
        Interpolace metodou sinc: v této metodě je každý bod proložen funkcí
        sinc, kdy vznikne nové pole celého rozsahu a tato pole jsou poté
        sečtena. Funkce sinc je definována v nekonečném rozsahu, pro účely
        aplikace je však uvažována pouze rozsah grafu. Více informací viz{' '}
        <a
          href="https://en.wikipedia.org/wiki/Whittaker%E2%80%93Shannon_interpolation_formula"
          target="_blank"
          rel="noreferrer"
        >
          interpolace metodou sinc
        </a>{' '}
        (v angličině).
      </p>
    </div>
  )
}

export default Teorie
