import { CategoryInfoType } from '@shared/types/CategoryInfoType'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import s from './CategoryCard.module.scss'

type CategoryCardProps = {
  className?: string
  item: CategoryInfoType
}

const CategoryCard: React.FC<CategoryCardProps> = ({ className, item }) => {
  return (
    <Link className={cn(s['category-card'], className)} href={item.link}>
      <div className={s['category-card__image']}>
        <Image src={item.product.images[0].url} alt='category' fill />
      </div>
      <p className={s['category-card__text']}>
        {item.product.productCategory.title}
      </p>
    </Link>
  )
}

export default CategoryCard
