'use client'

import Card from '@shared/components/Card'
import './History.scss'

const HistoryPage = () => {
  const products = JSON.parse(
    localStorage.getItem('orderHistory') || '[]'
  ) as Array<{
    id: number
    title: string
    price: number
    discountPercent: number
    quantity: number
    description: string
    images: { id: number; url: string }[]
    rating: number
  }>

  console.log(products)

  return (
    <section className='history'>
      <div className='history__container'>
        <h2 className='history__title'>History</h2>
        <div className='history__body'>
          {products.length === 0 ? (
            <div>No orders yet</div>
          ) : (
            products.map((item) => (
              <Card
                key={item.id}
                className='history__card'
                images={item.images}
                title={item.title}
                subtitle={item.description}
                contentSlot={`${item.price}`}
                productId={String(item.id)}
                productNumberId={item.id}
                discountPercent={item.discountPercent}
                rating={item.rating}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default HistoryPage
