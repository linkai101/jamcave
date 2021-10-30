import React from 'react';
import { useRouter } from 'next/router';

import {
  Container,
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Button,
  Input,
  Spinner,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';

import Slide from '../../lib/Slide';
import SlidePreview from '../../lib/SlidePreview';
import ClientDataTransfer from '../../lib/ClientDataTransfer';
import serialize from '../../lib/serialize';
import deserialize from '../../lib/deserialize';

import SessionNavbar from '../../components/SessionNavbar';
import Canvas from '../../components/Canvas';

// TODO: issue, currentSlideIndexRef slidePreviews always updated when not supposed to
// idea: have one slides state, every slide is preview except for current slide

export default function SessionPage() {
  const router = useRouter(); // router.query
  const toast = useToast();

  const [slidePreviews, _setSlidePreviews] = React.useState([new SlidePreview()]); // summary of all slides (WITHOUT stroke data)
  const slidePreviewsRef = React.useRef(slidePreviews);
  const setSlidePreviews = value => {
    slidePreviewsRef.current = value;
    _setSlidePreviews(value);
  };

  const [currentSlide, setCurrentSlide] = React.useState(new Slide()); // current slide (with stroke data)
  const [currentSlideIndex, _setCurrentSlideIndex] = React.useState(0); // index of current slide
  const currentSlideIndexRef = React.useRef(currentSlideIndex);
  const setCurrentSlideIndex = value => {
    currentSlideIndexRef.current = value;
    _setCurrentSlideIndex(value);
  };

  const [lastSlideSyncId, _setLastSlideSyncId] = React.useState(null);
  const lastSlideSyncIdRef = React.useRef(lastSlideSyncId);
  const setLastSlideSyncId = value => {
    lastSlideSyncIdRef.current = value;
    _setLastSlideSyncId(value);
  };

  // p2p setup
  const [peerId, setPeerId] = React.useState();
  const [connRef, setConnRef] = React.useState();
  React.useEffect(() => {
    if (!router.query.id) return;

    import('peerjs').then(({ default: Peer }) => {
      const peer = new Peer({
        host: "0.peerjs.com",
        port: 443,
        path: "/",
        pingInterval: 5000,
      });

      peer.on('open', () => {
        setPeerId(peer.id);
        console.log(`Peer opened! (${peer.id})`);

        const conn = peer.connect(router.query.id);

        conn.on('open', () => {
          setConnRef(conn);
          console.log('Connected!');
          
          // initial data request
          const request = new ClientDataTransfer('request', { currentSlideIndex:currentSlideIndexRef.current });
          conn.send(serialize(request));
        });

        conn.on('data', (data) => {
          const { id, type, options } = deserialize(data);
          switch (type) {
            case "slide": {
              const { slide:hostSlide } = options;

              // update current slide
              setCurrentSlide(hostSlide);
              
              setLastSlideSyncId(id);
              break;
            }
            case "slideChange": { // new slide changed from host, request back if is current slide
              const { id, changedSlideIndex } = options;
              
              if (changedSlideIndex === currentSlideIndexRef.current && lastSlideSyncId !== id) {
                const request = new ClientDataTransfer('request', { currentSlideIndex:currentSlideIndexRef.current });
                conn.send(serialize(request));
              }
              break;
            }
            case "slideDeletion": { // slide deleted from host, adjust currentSlideIndex (assuming previews are synced)
              const { slideIndex } = options;
              if (slideIndex<currentSlideIndexRef.current || (slideIndex===currentSlideIndexRef.current && slideIndex===slidePreviewsRef.current.length-1))
                setCurrentSlideIndex(currentSlideIndexRef.current-1); // adjust index position based on the deleted slide position
              break;
            }
            case "previews": { // slide previews changed from host
              const { slidePreviews:hostSlidePreviews } = options;
              setSlidePreviews(hostSlidePreviews);
              break;
            }
            case "message": {
              console.log("MESSAGE FROM HOST:", options.content);
              toast({
                title: options.content,
                status: "info",
                duration: 3000,
              });

              break;
            }
          };
        });

        conn.on('error', (err) => {
          console.error(err);
          toast({
            title: "An error occured!",
            status: "error",
            duration: 3000,
          });
        })

        conn.on('close', () => {
          console.log("Connection closed!");
          toast({
            title: "Disconnected from host!",
            status: "warning",
            duration: 3000,
          });
        });
      });
    });
  }, [router.query.id]);

  // [p2p] when slide data updated, send data to host
  function syncSlide(newSlide) {
    if (!connRef) return;

    const slideTransfer = new ClientDataTransfer('slide', { slide: newSlide, currentSlideIndex });
    connRef.send(serialize(slideTransfer));
  }

  // [p2p] when slide previews updated, send data to host
  function syncPreviews(newPreviews) {
    if (!connRef) return;

    const previewsTransfer = new ClientDataTransfer('previews', { slidePreviews: newPreviews });
    connRef.send(serialize(previewsTransfer));
  }

  // [p2p] on slide switch, request new data
  React.useEffect(() => {
    if (!connRef) return;
    const request = new ClientDataTransfer('request', { currentSlideIndex });
    connRef.send(serialize(request));
  }, [currentSlideIndex]);

  if (!connRef) return (<>
    <Flex direction="column" h="100vh">
      <SessionNavbar connRef={connRef}/>

      <Container flex={1} maxW="container.xl">
        <Flex h="100%" align="center" justify="center">
          <Spinner color="secondary" mr={4}/>
          <Box>
            <Heading size="sm">Connecting to host...</Heading>
            <Text fontSize="sm">Not loading? Check your invite link.</Text>
          </Box>
        </Flex>
      </Container>
    </Flex>
  </>);

  return (<>
    <Flex direction="column" h="100vh">
      <SessionNavbar connRef={connRef}/>

      <Container flex={1} maxW="container.xl" overflow="hidden">
        <Flex pt={4} pb={1} h="100%">
          <Flex direction="column" h="100%">
            <Box flex={1} w="224px" px={1} overflow="auto">
              {slidePreviews.map((s,i) => 
                <Flex key={i}
                  h="126px" ml={2} my={1}
                  borderWidth="2px" borderRadius="lg" borderColor={i===currentSlideIndex ? 'secondary' : 'auto'}
                  justify="center" align="center" position="relative"
                  onClick={e => {
                    if (e.target === e.currentTarget) setCurrentSlideIndex(i)
                  }}
                  key={s.id}
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
                      const deleteSlideRequest = new ClientDataTransfer('deleteSlide', { slideIndex:i });
                      connRef.send(serialize(deleteSlideRequest));
                    }}
                  >🗑️</Button>
                  
                  <Box mx={4}>
                    <Input variant={s.name ? "unstyled" : "flushed"}
                      size="xs" fontSize="md" textAlign="center"
                      contentEditable={true}
                      value={s.name}
                      placeholder="Click to add title"
                      onChange={e => {
                        setSlidePreviews(slidePreviews.map((s1,i1) => {
                          if (i1 === i) s1.name = e.target.value;
                          return s1;
                        }));
                      }}
                      onBlur={e => {
                        syncPreviews(slidePreviews.map((s1,i1) => {
                          if (i1 === i) s1.name = e.target.value;
                          return s1;
                        }));
                      }}
                    />
                  </Box>

                </Flex>
              )}
            </Box>

            <Flex h="32px" align="center" justify="center" borderTopWidth="1px">
              <Button size="xs" fontSize="sm"
                onClick={() => {
                  const createSlideRequest = new ClientDataTransfer('createSlide');
                  connRef.send(serialize(createSlideRequest));
                }}
              >+</Button>
            </Flex>
          </Flex>
          
          <Box flex={1} pl={4} pr={1} overflow="auto">
            <Canvas
              slide={currentSlide}
              setSlide={(newSlide) => {
                setCurrentSlide(newSlide);
                syncSlide(newSlide);
              }}
            />
          </Box>
        </Flex>
      </Container>
    </Flex>
  </>);
}