import type { AppProps } from 'next/app'
import Nav from '../src/components/Nav'
import ScrollTop from '../src/components/ScrollTop'
import '../src/styles/main.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="App">
      <ScrollTop />
      <Nav />
      <Component {...pageProps} />
    </div>
  )
}

