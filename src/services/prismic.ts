import * as prismic from '@prismicio/client'

export function getPrismicClient(req?: unknown) {
  const endpoint = prismic.getRepositoryName(process.env.PRISMIC_ENDPOINT!)

  const client = prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN!,
  })

  return client
}
