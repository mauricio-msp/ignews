import Head from 'next/head'
import Image from 'next/image'
import type { NextPage, GetStaticProps } from 'next'

// components
import { SubscribeButton } from '../components/SubscribeButton'

// services
import { stripe } from '../services/stripe'

// home.module.scss
import styles from './home.module.scss'

// types
type HomeProps = {
  product: {
    priceId: string
    amount: number
  }
}

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.contentHero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world
          </h1>
          <p>
            Get access to all the publications <br />{' '}
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          width={700}
          height={700}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KaMGKDiCxHf17UEYIwpmba9', {
    expand: ['product'],
  })

  const product = {
    pricerId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount! / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}

export default Home
