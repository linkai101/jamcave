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
  useColorModeValue,
} from '@chakra-ui/react';

import Navbar from '../components/Navbar';

export default function Home() {
  const [inviteValue, setInviteValue] = React.useState();

  return (<>
    <Navbar/>

    <Box
      bg={useColorModeValue('gray.200', 'gray.500')}
    >
      <Container maxW="container.lg"
        py={20} px={6}
      >
        <Heading>Collaborate. Present. Jam.</Heading>
        <Text mt={2} fontSize="xl">
          Visualize, experiment, and engage in real-time like never before — with drawing, coding, and LaTeX tools right at your fingertips.
        </Text>

        <Button mt={4}>Host a session</Button>
      </Container>
    </Box>

    <Box
      bg={useColorModeValue('secondary', 'secondary2')} color="text.onSecondary"
    >
      <Container maxW="container.lg"
        py={12} px={6}
      >
        <Flex direction={{ base: "column", sm: "row" }}>
          <Box flex={1} p={3}>
            <Heading size="md">Have an invite link?</Heading>
            <Flex>
              <Input mt={3} w="200px"
                variant="filled" size="sm" borderRadius="md"
                placeholder="Paste your invite link here"
                value={inviteValue}
                onChange={e => setInviteValue(e.target.value)}
              />

              {inviteValue && 
                <NextLink href={inviteValue} passHref>
                <Link style={{ textDecoration: "none" }}>
                    <Button mt={3} size="sm" ml={2} colorScheme="orange">Join</Button>
                  </Link>
                </NextLink>
              }
            </Flex>
          </Box>

          <Box flex={1} p={3}>
            <Heading size="md">Looking to host a jam session?</Heading>
            
            <NextLink href="/s/host" passHref>
              <Link style={{ textDecoration: "none" }}>
                <Button mt={3} size="sm" colorScheme="orange">Host a session</Button>
              </Link>
            </NextLink>
          </Box>
        </Flex>
      </Container>
    </Box>
  </>);
}
