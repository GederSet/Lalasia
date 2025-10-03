'use client'

import { useCategoriesPageStore } from '@shared/store/CategoriesStore/CategoriesPageStoreProvider'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import s from './Categories.module.scss'
import CategoryCard from './components/CategoryCard'

const CategoriesList = () => {
  const categoriesStore = useCategoriesPageStore()

  console.log(toJS(categoriesStore.categoryItems))

  return (
    <section className={s['categories']}>
      <div className={s['categories__container']}>
        <div className={s['categories__body']}>
          {categoriesStore.categoryItems.map((item) => (
            <CategoryCard
              key={item.product.id}
              className={s['categories__card']}
              item={item}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default observer(CategoriesList)
