import React from 'react';
import NextLink from 'next/link';

import {
  Container,
  Flex,
  Stack,
  Box,
  Heading,
  Image,
  Button,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

import ColorModeToggle from './ColorModeToggle';

export default function Navbar({ ...rest }) {
  return (
    <Box
      bg={useColorModeValue('bg.light','bg.dark')} color={useColorModeValue('primary','primary2')}
      borderBottomWidth={1}
      {...rest}
    >
      <Container maxW="container.xl" px={8} py={2}>
        <Flex as="nav" direction="row" align="center" justify="space-between" wrap="wrap">
          <Logo mr={2}/>
          <Links flex={1}/>
        </Flex>
      </Container>
    </Box>
  )
}

function Logo({ ...rest }) {
  return (
    <NextLink href="/" passHref>
      <Link {...rest}>
        <Heading size="md">Jamcave</Heading>
      </Link>
    </NextLink>
  );
}

function Links({ ...rest }) {
  return (
    <Box {...rest} pl={4}>
      <Stack
        direction="row"
        justify="flex-end"
        align="center"
        spacing={3}
      >
        <ColorModeToggle size="sm" color="text.onPrimary" colorScheme="blackAlpha"/>
        <Button size="sm" color="text.onPrimary" colorScheme="blackAlpha">
          Leave session
        </Button>
      </Stack>
    </Box>
  );
}
