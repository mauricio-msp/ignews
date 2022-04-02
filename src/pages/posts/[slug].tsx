import Head from 'next/head'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

import * as prismicH from '@prismicio/helpers'

// services
import { getPrismicClient } from '../../services/prismic'

// utils
import { dateFormat } from '../../utils/dateFormat'

// styles
import styles from './post.module.scss'

// types
type PostType = {
  slug: string
  title: string
  content: string
  updatedAt: string
}

type PostProps = {
  post: PostType
}

const Post: NextPage<PostProps> = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title} | ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req })
  const { slug } = params || {}

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const client = getPrismicClient(req)

  const response = await client.getByUID('publication', String(slug), {})

  const post = {
    slug,
    title: prismicH.asText(response.data.title),
    content: prismicH.asHTML(response.data.content),
    updatedAt: dateFormat(response.last_publication_date),
  }

  return {
    props: {
      post,
    },
  }
}

export default Post
