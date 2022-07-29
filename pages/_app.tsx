import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useEffect } from 'react'
import { NextPage } from 'next'
import { SessionProvider } from "next-auth/react"

import '../styles/custom.sass'
import '../styles/scrollbars.sass'
import '../styles/rect-img.sass';
import '../styles/image-upload.sass';
import '../styles/aspect-ratio.sass';
import '../styles/hover-effects.sass';
import '../styles/wheel.css';
import '../styles/rotate.sass';
import '../styles/image.sass';
import '../styles/effects.sass';
import 'simplebar/dist/simplebar.min.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import Head from 'next/head'

export type NextPageWithLayout = NextPage<any> & {
  getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const egg = { enabled: false } //TODO
  return <SessionProvider session={session}>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div id="app" className={`mh-100 bg-dark-900 ${egg.enabled ? `body-egg` : ``}`}>
      {getLayout(<Component {...pageProps} />)}
    </div>
  </SessionProvider>
}

export default MyApp
