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

export default function SessionNavbar({ connRef, isHost, peerId, toast, ...rest }) {
  return (
    <Box
      bg={useColorModeValue('bg.light','bg.dark')} color={useColorModeValue('primary','primary2')}
      borderBottomWidth={1}
      {...rest}
    >
      <Container maxW="container.xl" px={8} py={2}>
        <Flex as="nav" direction="row" align="center" justify="space-between" wrap="wrap">
          <Logo mr={2}/>
          <Links flex={1} connRef={connRef} isHost={isHost} peerId={peerId} toast={toast}/>
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

function Links({ connRef, isHost, peerId, toast, ...rest }) {
  return (
    <Box {...rest} pl={4}>
      <Stack
        direction="row"
        justify="flex-end"
        align="center"
        spacing={3}
      >
        <ColorModeToggle size="sm" color="text.onPrimary" colorScheme="blackAlpha"/>
        {isHost && peerId &&
          <Button size="sm" color="text.onPrimary" colorScheme="blackAlpha"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/s/${peerId}`);

              toast({
                title: "Invite link copied to clipboard!",
                status: "info",
                variant: "subtle",
                duration: 3000,
              });
            }}
          >
            Copy Invite
          </Button>
        }
        <Button size="sm" color="text.onPrimary" colorScheme="blackAlpha"
          onClick={() => {
            connRef?.close();
            window.location.href = '/';
          }}
        >
          {isHost ? "End session" : connRef ? "Leave session" : "Go home"}
        </Button>
      </Stack>
    </Box>
  );
}
