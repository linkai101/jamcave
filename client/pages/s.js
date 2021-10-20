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
                    fontSize="sm" fontWeight="bold"
                  >
                    {i+1}
                  </Text>

                  <Button position="absolute" bottom={1} right={1}
                    size="xs" p={0}
                    onClick={() => {
                      // TODO
                    }}
                  >
                    🗑️
                  </Button>

                  {/*<Text fontSize="md" contentEditable={true}
                    onBlur={e => {
                      setSlides(slides.map((s1,i1) => {
                        if (i1 === i) s1.setName(e.target.innerHTML);
                        return s1;
                      }))
                    }} dangerouslySetInnerHTML={{ __html: s.name }}
                  />*/}
                  <Input variant={s.name ? "unstyled" : "flushed"}
                    size="xs" fontSize="md" textAlign="center"
                    contentEditable={true} mx={4}
                    value={s.name}
                    onChange={e => {
                      setSlides(slides.map((s1,i1) => {
                        if (i1 === i) s1.setName(e.target.value);
                        return s1;
                      }))
                    }}
                  />

                </Flex>
              )}
            </Box>

            <Flex h="32px" align="center" justify="center" borderTopWidth="1px">
              <Button size="xs" onClick={() => setSlides([...slides, new Slide()])}>+</Button>
            </Flex>
          </Flex>
          
          <Box flex={1} pl={4} pr={1} overflow="auto">
            <Canvas
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
  constructor(name, elements) {
    this.name = name || "Click to add name";
    this.elements = elements || [];
  }

  setName(name) {
    this.name = name;
  }

  setElements(elements) {
    this.elements = elements;
  }
}