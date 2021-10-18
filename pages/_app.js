import '../styles/globals.css';
import Head from 'next/head';
import { ChakraProvider } from "@chakra-ui/react";
import theme from '../lib/theme';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Title</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ChakraProvider theme={theme} resetCSS>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;