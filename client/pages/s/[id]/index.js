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

import Slide from '../../../lib/Slide';
import SlidePreview from '../../../lib/SlidePreview';

import SessionNavbar from '../../../components/SessionNavbar';
import Canvas from '../../../components/Canvas';

export default function SessionPage() {
  // TODO: update with backend
  const [slides, setSlides] = React.useState([new SlidePreview()]); // summary of all slides (without stroke data)
  const [currentSlide, setCurrentSlide] = React.useState(new Slide()); // current slide (with stroke data)
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0); // index of current slide

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
                  borderWidth="2px" borderRadius="lg" borderColor={i===currentSlideIndex ? 'secondary' : 'auto'}
                  justify="center" align="center" position="relative"
                  onClick={() => setCurrentSlideIndex(i)}
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
                      // TODO: add slide deletion
                    }}
                  >🗑️</Button>
                  
                  <Box mx={4}>
                    <Input variant={s.name ? "unstyled" : "flushed"}
                      size="xs" fontSize="md" textAlign="center"
                      contentEditable={true}
                      value={s.name}
                      placeholder="Click to add title"
                      onChange={e => {
                        setSlides(slides.map((s1,i1) => {
                          if (i1 === i) s1.name = e.target.value;
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
                onClick={() => {
                  // TODO: add new slide
                }}
              >+</Button>
            </Flex>
          </Flex>
          
          <Box flex={1} pl={4} pr={1} overflow="auto">
            <Canvas
              slide={currentSlide}
              setSlide={setCurrentSlide}
            />
          </Box>
        </Flex>
      </Container>
    </Flex>
  </>);
}