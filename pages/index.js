import React from 'react';
import NextLink from 'next/link';

import {
  Container,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Link,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';

import Navbar from '../components/Navbar';

export default function Home() {

  return (<>
    <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue("primary", "primary2")}>
      <Box align="center">
        <Image h={12} src="/assets/default-monochrome-white.svg"/>
        <Text fontSize="xl" color="text.onPrimary" mt={2}>
          A collaborative &amp; interactive whiteboard.
        </Text>
        <NextLink href="/s/host/" passHref>
          <Link style={{ textDecoration: "none" }}>
            <Button mt={4} colorScheme="orange">Host a session</Button>
          </Link>
        </NextLink>
      </Box>
    </Flex>

    <Box w="100%" px={2} position="absolute" bottom="0" textAlign="right">
      <Link href="https://linkaiwu.com" isExternal>
        (c) Linkai Wu
      </Link>
    </Box>
  </>);
}
