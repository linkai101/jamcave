import React from 'react';

import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

import Navbar from '../components/Navbar';

export default function Home() {
  return (<>
    <Navbar/>

    <Box
      bg={useColorModeValue('gray.200', 'gray.500')}
    >
      <Container maxW="container.lg"
        py={12} px={6}
      >
        <Heading>Collaborate. Present. Jam.</Heading>
        <Text mt={2} fontSize="xl">
          Visualize, experiment, and engage in real-time like never before — with drawing, coding, and LaTeX tools right at your fingertips.
        </Text>

        <Button mt={4}>Host a demo session</Button>
      </Container>
    </Box>
  </>);
}
