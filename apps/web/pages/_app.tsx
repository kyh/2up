import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
import 'raf/polyfill'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import Router from 'next/router'
import { trpc } from '../utils/trpc'
import { StyleProvider } from '../styles/global'
import { AlertProvider, ProgressBar } from '../components'
import { AuthProvider } from '../lib/auth/useAuth'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { Provider } from 'app/provider'
import React, { startTransition } from 'react'

const progress = new ProgressBar()

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type Props = AppProps & {
  Component: Page
}

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeError', progress.finish)
Router.events.on('routeChangeComplete', progress.finish)

const MyApp = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <StyleProvider>
      <AlertProvider>
        <AuthProvider>
          <ThemeProvider>
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </AuthProvider>
      </AlertProvider>
    </StyleProvider>
  )
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        startTransition(() => {
          setTheme(next)
        })
      }}
    >
      <Provider disableRootThemeClass defaultTheme={theme}>
        {children}
      </Provider>
    </NextThemeProvider>
  )
}

export default trpc.withTRPC(MyApp)
