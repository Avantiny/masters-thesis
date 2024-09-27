const ZmenaHodnoty = (props: {
  hodnota: number;
  zpracujZmenuHodnoty: (T: string) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
}) => {
  return (
    <p>
      <input
        type="range"
        value={props.hodnota}
        min={props.min.toString()}
        max={props.max.toString()}
        step={props.step.toString()}
        className={props.className}
        onChange={(e) => props.zpracujZmenuHodnoty(e.currentTarget.value)}
      ></input>
    </p>
  );
};

export default ZmenaHodnoty;
