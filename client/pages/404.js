import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';

import {
  Box,
  Flex,
  Heading,
  Text,
  Link,
  Button,
} from '@chakra-ui/react';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404!</title>
      </Head>

      <Flex minH="90vh" align="center" justify="center">
        <Box align="center">
          <Heading as="h1" size="2xl">404!</Heading>
          <Text fontSize="lg">Sorry, that page isn't here.</Text>
          <NextLink href="/" passHref>
            <Link style={{ textDecoration: "none" }}>
              <Button mt={4}>🏠 Go Home</Button>
            </Link>
          </NextLink>
        </Box>
      </Flex>
    </>
  );
}