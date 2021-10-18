import React from 'react';

import {
  Container,
  Heading,
  Text,
} from '@chakra-ui/react';

import ColorModeToggle from '../components/ColorModeToggle';

export default function Home() {
  return (
    <Container 
      maxW="container.md" p={8}
      align="center"
    >
      <Heading as="h1" size="xl" my={2}>Jamcave</Heading>
      <Heading as="h2" size="md" fontWeight="normal" my={2}>
        This is an example.
      </Heading>

      <Text>This is an example sentence. This is an example sentence. This is an example sentence. This is an example sentence.</Text>

      <Heading as="h3" size="md" mt={6}>This is another example.</Heading>

      <ColorModeToggle/>
    </Container>
  );
}
