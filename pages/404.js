import React from 'react';

import {
  Container,
  Heading,
  Code,
  Link,
  Button,
} from '@chakra-ui/react';

export default function Custom404() {
  return (
    <Container 
      maxW="container.md" p={8} pt={16}
      align="center"
    >
      <Heading as="h1" size="xl" my={2}>404: Not found</Heading>
      <Heading as="h2" size="md" fontWeight="normal" my={2}>
        Edit this page in <Code>/pages/404.js</Code>
      </Heading>
      <Link href="/" style={{ textDecoration: "none" }}>
        <Button mt={8}>Go home</Button>
      </Link>
    </Container>
  );
}
