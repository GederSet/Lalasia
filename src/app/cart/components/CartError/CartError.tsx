type CartErrorProps = {
  text: string
}

const CartError: React.FC<CartErrorProps> = ({ text }) => {
  return <div>{text}</div>
}

export default CartError
