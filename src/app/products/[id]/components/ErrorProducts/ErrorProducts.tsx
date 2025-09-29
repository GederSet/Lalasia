type ErrorProductsProps = {
  text: string
}
const ErrorProducts: React.FC<ErrorProductsProps> = ({ text }) => {
  return <div>{text}</div>
}

export default ErrorProducts
