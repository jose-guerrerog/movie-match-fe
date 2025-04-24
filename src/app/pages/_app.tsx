import type { AppProps } from 'next/app';
import '../styles/globals.css';
import RootLayout from '@/app/layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}