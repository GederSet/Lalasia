import s from './AboutUs.module.scss'

const AboutUsPage = () => {
  return (
    <section className={s['about-us']}>
      <div className={s['about-us__container']}>
        <div className={s['about-us__box']}>
          <h1
            className={`${s['about-us__title']} ${s['about-us__title_main']}`}
          >
            About Us – Lalasia
          </h1>
          <p className={s['about-us__text']}>
            Welcome to Lalasia, your trusted destination for quality products
            that make everyday life better. We believe that shopping should be
            simple, enjoyable, and reliable. That's why Lalasia brings together
            a diverse range of items — from cutting-edge laptops and stylish
            footwear to modern furniture and home essentials — all in one place.
          </p>
        </div>
        <div className={s['about-us__box']}>
          <h2 className={s['about-us__title']}>Our Mission</h2>
          <p className={s['about-us__text']}>
            At Lalasia, our mission is to create a seamless shopping experience
            that combines variety, affordability, and trust. We aim to provide
            our customers with products that enhance comfort, inspire
            creativity, and support their lifestyle, whether at work, at home,
            or on the go.
          </p>
        </div>
        <div className={s['about-us__box']}>
          <h2 className={s['about-us__title']}>What We Offer</h2>
          <div className={s['about-us__body']}>
            <p
              className={`${s['about-us__text']} ${s['about-us__text_circle']}`}
            >
              Technology & Gadgets: Powerful laptops, accessories, and smart
              devices to keep you connected and productive.
            </p>
          </div>
          <div className={s['about-us__body']}>
            <p
              className={`${s['about-us__text']} ${s['about-us__text_circle']}`}
            >
              Fashion & Footwear: Trendy and comfortable shoes for every
              occasion, designed for both style and practicality.
            </p>
          </div>
          <div className={s['about-us__body']}>
            <p
              className={`${s['about-us__text']} ${s['about-us__text_circle']}`}
            >
              Furniture & Home Living: Modern, functional, and elegant pieces
              that make your space feel like home.
            </p>
          </div>
          <div className={s['about-us__body']}>
            <p
              className={`${s['about-us__text']} ${s['about-us__text_circle']}`}
            >
              Everyday Essentials: A wide selection of products to simplify
              daily life.
            </p>
          </div>
        </div>
        <div className={s['about-us__box']}>
          <h2 className={s['about-us__title']}>Our Values</h2>
          <div className={s['about-us__body']}>
            <p
              className={`${s['about-us__text']} ${s['about-us__text_circle']}`}
            >
              Quality First: We carefully curate our catalog to ensure every
              item meets high standards.
            </p>
          </div>
          <div className={s['about-us__body']}>
            <p
              className={`${s['about-us__text']} ${s['about-us__text_circle']}`}
            >
              Customer Focus: Your satisfaction is at the heart of everything we
              do.
            </p>
          </div>
          <div className={s['about-us__body']}>
            <p
              className={`${s['about-us__text']} ${s['about-us__text_circle']}`}
            >
              Innovation: We keep an eye on the latest trends and technologies
              to bring fresh solutions to our customers.
            </p>
          </div>
          <div className={s['about-us__body']}>
            <p
              className={`${s['about-us__text']} ${s['about-us__text_circle']}`}
            >
              Trust & Transparency: We believe in honesty, fair prices, and
              reliable service.
            </p>
          </div>
        </div>
        <div className={s['about-us__box']}>
          <h2 className={s['about-us__title']}>Why Choose Lalasia?</h2>
          <p className={s['about-us__text']}>
            Shopping with Lalasia means more than just purchasing products —
            it's about joining a community that values convenience and trust.
            With fast delivery, secure payments, and a dedicated support team,
            we make sure every step of your shopping journey is smooth and
            worry-free.
          </p>
        </div>
        <div className={s['about-us__box']}>
          <h2 className={s['about-us__title']}>Our Vision</h2>
          <p className={s['about-us__text']}>
            We envision Lalasia as more than just an online store. We strive to
            become a lifestyle partner for people across the globe, delivering
            inspiration, innovation, and value in everything we offer.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutUsPage
