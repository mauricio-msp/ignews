import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

// components
import { Header } from '../components/Header'

// global.scss
import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
