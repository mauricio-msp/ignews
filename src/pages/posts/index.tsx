import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps, NextPage } from 'next'

import * as prismic from '@prismicio/client'
import * as prismicH from '@prismicio/helpers'

// services
import { getPrismicClient } from '../../services/prismic'

// utils
import { dateFormat } from '../../utils/dateFormat'

// styles
import styles from './styles.module.scss'

// types
type PostsType = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

type PostsProps = {
  posts: PostsType[]
}

const Posts: NextPage<PostsProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient()

  const response = await client.get({
    predicates: prismic.predicates.at('document.type', 'publication'),
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100,
  })

  const posts = response.results.map(post => ({
    slug: post.uid,
    title: prismicH.asText(post.data.title),
    excerpt:
      post.data.content.find(
        (content: Record<string, any>) => content.type === 'paragraph'
      )?.text ?? '',
    updatedAt: dateFormat(post.last_publication_date),
  }))

  return {
    props: {
      posts,
    },
  }
}

export default Posts
