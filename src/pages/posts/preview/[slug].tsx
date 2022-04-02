import { useEffect } from 'react'

import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import * as prismicH from '@prismicio/helpers'

// services
import { getPrismicClient } from '../../../services/prismic'

// utils
import { dateFormat } from '../../../utils/dateFormat'

// styles
import styles from '../post.module.scss'

// types
type PostPreviewType = {
  slug: string
  title: string
  content: string
  updatedAt: string
}

type PostPreviewProps = {
  post: PostPreviewType
}

const PostPreview: NextPage<PostPreviewProps> = ({ post }) => {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | preview</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params || {}

  const client = getPrismicClient()

  const response = await client.getByUID('publication', String(slug), {})

  const post = {
    slug,
    title: prismicH.asText(response.data.title),
    content: prismicH.asHTML(response.data.content.splice(0, 3)),
    updatedAt: dateFormat(response.last_publication_date),
  }

  return {
    props: {
      post,
    },
  }
}

export default PostPreview
