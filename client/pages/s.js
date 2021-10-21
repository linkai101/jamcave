import React from 'react';

import {
  Container,
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Button,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';

import SessionNavbar from '../components/SessionNavbar';
import Canvas from '../components/Canvas';

export default function SessionPage() {
  const [slides, setSlides] = React.useState([new Slide()]);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  return (<>
    <Flex direction="column" h="100vh">
      <SessionNavbar/>

      <Container flex={1} maxW="container.xl" overflow="hidden">
        <Flex pt={4} pb={1} h="100%">
          <Flex direction="column" h="100%">
            <Box flex={1} w="224px" px={1} overflow="auto">
              {slides.map((s,i) => 
                <Flex key={i}
                  h="126px" ml={2} my={1}
                  borderWidth="2px" borderRadius="lg" borderColor={i===currentSlide ? 'secondary' : 'auto'}
                  justify="center" align="center" position="relative"
                  onClick={() => setCurrentSlide(i)}
                >
                  <Text position="absolute" top={1} left={2}
                    fontSize="xs" fontWeight="bold"
                  >
                    {i+1}
                  </Text>

                  <Button position="absolute" bottom={1} right={1}
                    size="xs" p={0}
                    colorScheme="whiteAlpha"
                    onClick={() => {
                      // TODO: add slide deletion (also optimize currentslide for multiplayer)
                    }}
                  >🗑️</Button>
                  
                  <Box mx={4}>
                    <Input variant={s.name ? "unstyled" : "flushed"}
                      size="xs" fontSize="md" textAlign="center"
                      contentEditable={true}
                      value={s.name}
                      onChange={e => {
                        setSlides(slides.map((s1,i1) => {
                          if (i1 === i) s1.setName(e.target.value);
                          return s1;
                        }))
                      }}
                    />
                  </Box>

                </Flex>
              )}
            </Box>

            <Flex h="32px" align="center" justify="center" borderTopWidth="1px">
              <Button size="xs" fontSize="sm"
                onClick={() => setSlides([...slides, new Slide()])}
              >+</Button>
            </Flex>
          </Flex>
          
          <Box flex={1} pl={4} pr={1} overflow="auto">
            <Canvas
              dimensions={slides[currentSlide].dimensions}
              elements={slides[currentSlide].elements}
              setElements={(newElements) => 
                setSlides(slides.map((s,i) => {
                  if (i === currentSlide) s.setElements(newElements);
                  return s;
                })
              )}
            />
          </Box>
        </Flex>
      </Container>
    </Flex>
  </>);
}

class Slide {
  constructor(name, dimensions, elements) {
    this.name = name; //|| "Click to add title";
    this.dimensions = dimensions || { x: 1280, y: 720 };
    this.elements = elements || [];
  }

  setName(name) {
    this.name = name;
  }

  setElements(elements) {
    this.elements = elements;
  }
}