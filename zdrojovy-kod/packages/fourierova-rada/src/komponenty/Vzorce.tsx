import efektivni from '../obrazky/efektivni.png';
import stredni from '../obrazky/stredni.png';

export const Vzorce = () => {
  return (
    <div>
      <h3>Vzorce:</h3>
      <p>
        <p>Střední hodnota:</p>
        <img src={stredni} alt="stredni" height="60px" width="160px" />
        <p>Efektivní hodnota:</p>
        <img src={efektivni} alt="efektivni" height="60px" width="160px" />
      </p>
    </div>
  );
};
