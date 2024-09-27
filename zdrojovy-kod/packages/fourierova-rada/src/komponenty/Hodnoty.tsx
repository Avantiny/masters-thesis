const Hodnoty = (props: { stredni: number; efektivni: number }) => {
  return (
    <div>
      <h3>Hodnoty:</h3>
      <p>Střední hodnota: {props.stredni.toFixed(3)}</p>
      <p>Efektivní hodnota: {props.efektivni.toFixed(3)}</p>
    </div>
  );
};

export default Hodnoty;
