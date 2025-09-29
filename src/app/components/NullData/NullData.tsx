type NullDataProps = {
  text: string
}
const NullData: React.FC<NullDataProps> = ({ text }) => {
  return <div>{text}</div>
}

export default NullData
