const ZmenaHodnoty = (props: {
  hodnota: number
  zpracujZmenuHodnoty: (T: string) => void
  min?: number
  className?: string
}) => {
  return (
    <p>
      <input
        type="range"
        value={props.hodnota}
        min={props.min ?? '5'}
        max="1000"
        step="1"
        className={props.className}
        onChange={(e) => props.zpracujZmenuHodnoty(e.currentTarget.value)}
      ></input>
    </p>
  )
}

export default ZmenaHodnoty
