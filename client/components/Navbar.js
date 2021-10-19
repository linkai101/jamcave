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

import ColorModeToggle from '../components/ColorModeToggle';

export default function Navbar({ ...rest }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Box
      position="sticky" top={0} zIndex={999}
      bg={useColorModeValue('primary','primary2')} color="text.onPrimary"
      {...rest}
    >
      <Container maxW="container.xl" px={8} py={2}>
        <Flex as="nav" direction="row" align="center" justify="space-between" wrap="wrap">
          <Logo mr={2}/>
          <Toggle toggle={toggle} isOpen={isOpen}/>
          <Links flex={1} display={{ base: isOpen ? "block" : "none", sm: "block" }}/>
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
    <Box {...rest} pl={4} flexBasis={{ base: "100%", sm: "auto" }}>
      <Flex 
        direction={["column", "row", "row", "row"]} 
        py={[4, 0, 0, 0]}
      >
        <Stack flex={1} pt={1}
          direction="row"
          justify={["center", "flex-start", "flex-start", "flex-start"]}
          align="center"
          spacing={4}
        >
          <NextLink href="/" passHref>
            <Link fontWeight="semibold">Home</Link>
          </NextLink>
          <NextLink href="/" passHref>
            <Link fontWeight="semibold">About</Link>
          </NextLink>
        </Stack>
        <Stack
          direction="row"
          justify={["center", "flex-end", "flex-end", "flex-end"]}
          align="center"
          spacing={3}
          pt={[4, 0, 0, 0]}
        >
          <ColorModeToggle size="sm" color="text.onPrimary" colorScheme="blackAlpha"/>
          <Button size="sm" color="text.onPrimary" colorScheme="blackAlpha">
            Join a session
          </Button>
          <Button size="sm" color="text.onPrimary" colorScheme="blackAlpha">
            Login
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
}

function Toggle(props) {
  const { toggle, isOpen } = props;
  return (
    <Box 
      display={{ base: "block", sm: "none" }} p={2}
      onClick={toggle}
    >
      {isOpen ? <CloseIcon/> : <HamburgerIcon w={5} h={5}/>}
    </Box>
  );
}