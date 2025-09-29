type ErrorProductProps = {
  text: string
}
const ErrorProduct: React.FC<ErrorProductProps> = ({ text }) => {
  return <div>{text}</div>
}

export default ErrorProduct
