import React from 'react';

import {
  Container,
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

import SessionNavbar from '../components/SessionNavbar';
import Canvas from '../components/Canvas';

export default function SessionPage() {
  //const [slides, setSlides] = React.useState([{ id: 1, elements: [] }]);
  //const [selected, setSelected] = React.useState(0);

  return (<>
    <Flex direction="column" h="100vh">
      <SessionNavbar/>

      <Container flex={1} maxW="container.xl" overflow="hidden">
        <Flex pt={4} pb={1} h="100%">
          <Flex direction="column" h="100%">
            <Box flex={1} w="224px" px={1} overflow="auto">
              {/*slides.map(s => 
                <Box key={s.id}
                  h="126px" ml={2} my={1}
                  borderWidth="2px" borderRadius="lg"
                ></Box>
              )*/}
              <Box
                h="126px" ml={2} my={1}
                borderWidth="2px" borderRadius="lg"
              ></Box>
            </Box>

            <Flex h="32px" align="center" justify="center" borderTopWidth="1px">
              <Text fontWeight="bold" fontSize="lg">+</Text>
            </Flex>
          </Flex>
          
          <Box flex={1} pl={4} pr={1} overflow="auto">
            <Canvas/>
          </Box>
        </Flex>
      </Container>
    </Flex>
  </>);
}