import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';

import { ThemeProvider } from "next-themes";
import type { AppProps } from 'next/app';

import Head from 'next/head';
import { ContextProvider } from '@contexts/Contextor';
import { WalletProvider } from '@contexts/WalletContext';
import { RainbowProvider } from '@contexts/RainbowProvider';
import { DefaultLayout } from '@components/DefaultLayout';

const providers = [
  RainbowProvider,
  WalletProvider
];

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Head>
        <title>{pageProps.title}</title>
        <meta name="viewport" content="width=device-width"/>
        <meta name="theme-color" content="rgb(48 51 58)"/>
      </Head>
      <ContextProvider providers={providers}>
        <DefaultLayout pageProps={pageProps}>
          <Component {...pageProps} />
        </DefaultLayout>
      </ContextProvider>
    </ThemeProvider>
  );
}