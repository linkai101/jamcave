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
  useToast,
} from '@chakra-ui/react';

import Slide from '../../lib/Slide';
import SlidePreview from '../../lib/SlidePreview';
import HostDataTransfer from '../../lib/HostDataTransfer';
import serialize from '../../lib/serialize';
import deserialize from '../../lib/deserialize';

import SessionNavbar from '../../components/SessionNavbar';
import Canvas from '../../components/Canvas';

export default function SessionHostPage() {
  const toast = useToast();

  const [slides, _setSlides] = React.useState([new Slide()]); // all slides (WITH stroke data)
  const slidesRef = React.useRef(slides);
  const setSlides = value => {
    slidesRef.current = value;
    _setSlides(value);
  };

  const [currentSlideIndex, _setCurrentSlideIndex] = React.useState(0); // index of current slide
  const currentSlideIndexRef = React.useRef(currentSlideIndex);
  const setCurrentSlideIndex = value => {
    currentSlideIndexRef.current = value;
    _setCurrentSlideIndex(value);
  };

  // p2p setup
  const [peerId, setPeerId] = React.useState();
  const [conns, _setConns] = React.useState([]);
  const connsRef = React.useRef(conns);
  const setConns = newConns => {
    connsRef.current = newConns;
    _setConns(newConns);
  }
  React.useEffect(() => {
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
      });

      peer.on('connection', (conn) => {
        conn.on('open', () => {
          setConns([...connsRef.current, conn]);
          console.log(`Incoming connection! (${conn.peer})`);
          toast({
            title: "Someone just joined your jam session!",
            status: "info",
            duration: 3000,
          });

          // Greeting message
          const greetingMessage = new HostDataTransfer('message', { content: 'Connected to host!' });
          conn.send(serialize(greetingMessage));
        });

        conn.on('data', (data) => {
          const { id, type, options } = deserialize(data);
          switch (type) {
            case "request": {
              const { currentSlideIndex:clientCurrentSlideIndex } = options;
              
              // send slide previews
              const previewCallback = new HostDataTransfer('previews', { slidePreviews:slidesRef.current.map(s => new SlidePreview(s)) });
              conn.send(serialize(previewCallback));
              // send slide
              const slideCallback = new HostDataTransfer('slide', { slides:slidesRef.current, currentSlideIndex:clientCurrentSlideIndex });
              conn.send(serialize(slideCallback));
              break;
            }
            case "slide": {
              const {
                slide:clientSlide,
                currentSlideIndex:clientCurrentSlideIndex
              } = options;
              
              setSlides(slidesRef.current.map((s,i) => {
                if (i===clientCurrentSlideIndex) s = clientSlide; // update selected slide
                return s;
              }));
              
              announceSlideChange(clientCurrentSlideIndex, id);
              break;
            }
            case "previews": {
              const {
                slidePreviews:clientSlidePreviews,
              } = options;
          
              setSlides(slidesRef.current.map((s,i) => {
                s = { ...s, ...clientSlidePreviews[i] }; // update slide previews
                return s;
              }));
              
              syncPreviews(clientSlidePreviews);
              break;
            }
            case "createSlide": {
              let newSlide = new Slide();
              syncPreviews([...slidesRef.current, newSlide].map(s => new SlidePreview(s)));
              setSlides([...slidesRef.current, newSlide]);
              break;
            }
            case "deleteSlide": {
              const { slideIndex } = options;

              if (slidesRef.current.length === 1) {
                let newFirstSlide = new Slide();
                syncPreviews([new SlidePreview(newFirstSlide)])
                setSlides([newFirstSlide]);
                announceSlideChange(0);
                return;
              }

              announceSlideDeletion(slideIndex);
              // adjust index position based on the deleted slide position
              if (slideIndex<currentSlideIndexRef.current || (slideIndex===currentSlideIndexRef.current && slideIndex===slidesRef.current.length-1))
                setCurrentSlideIndex(currentSlideIndexRef.current-1);
              
              syncPreviews(slidesRef.current.filter((s,i) => i !== slideIndex).map(s => new SlidePreview(s)));
              setSlides(slidesRef.current.filter((s,i) => i !== slideIndex));
              break;
            }
            case "message": {
              console.log("MESSAGE FROM CLIENT:", options.content);
              break;
            }
          };
        });

        conn.on('error', (err) => {
          //console.error(err);
          toast({
            title: "An error occured with a connection!",
            status: "error",
            duration: 3000,
          });
        });

        conn.on('close', () => {
          toast({
            title: "Someone just left your jam session!",
            status: "warning",
            duration: 3000,
          });
        });
      });
    });
  }, []);
  
  function announceSlideChange(changedSlideIndex, changeId) {
    // announce change to all peers (if they need the slide, they will request back)
    connsRef.current.forEach(c => {
      if (!c.open) return;
      const announcement = new HostDataTransfer('slideChange', { changedSlideIndex }, changeId);
      c.send(serialize(announcement));
    });
  }
  
  function syncPreviews(slidePreviews) {
    // announce slide previews change to all peers
    connsRef.current.forEach(c => {
      if (!c.open) return;
      const announcement = new HostDataTransfer('previews', { slidePreviews });
      c.send(serialize(announcement));
    });
  }

  function announceSlideDeletion(slideIndex) {
    // announce slide deletion to all peers
    connsRef.current.forEach(c => {
      if (!c.open) return;
      const announcement = new HostDataTransfer('slideDeletion', { slideIndex });
      c.send(serialize(announcement));
    });
  }

  return (<>
    <Flex direction="column" h="100vh">
      <SessionNavbar
        isHost
        peerId={peerId}
        toast={toast}
      />

      <Container flex={1} maxW="container.xl" overflow="hidden">
        <Flex pt={4} pb={1} h="100%">
          <Flex direction="column" h="100%">
            <Box flex={1} w="224px" px={1} overflow="auto">
              {slides.map((s,i) => 
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
                      if (slides.length === 1) {
                        let newFirstSlide = new Slide();
                        syncPreviews([new SlidePreview(newFirstSlide)]);
                        setSlides([newFirstSlide]);
                        announceSlideChange(0);
                        return;
                      }

                      announceSlideDeletion(i);
                      // adjust index position based on the deleted slide position
                      if (i<currentSlideIndex || (i===currentSlideIndex && i===slides.length-1))
                        setCurrentSlideIndex(currentSlideIndex-1); 
                     
                      syncPreviews(slides.filter((s1,i1) => i1 !== i).map(s => new SlidePreview(s)));
                      setSlides(slides.filter((s1,i1) => i1 !== i));
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
                        }));
                      }}
                      onBlur={e => {
                        syncPreviews(slides.map(s => new SlidePreview(s)));
                      }}
                    />
                  </Box>

                </Flex>
              )}
            </Box>

            <Flex h="32px" align="center" justify="center" borderTopWidth="1px">
              <Button size="xs" fontSize="sm"
                onClick={() => {
                  let newSlide = new Slide();

                  syncPreviews([...slides, newSlide].map(s => new SlidePreview(s)));
                  setSlides([...slides, newSlide]);
                }}
              >+</Button>
            </Flex>
          </Flex>
          
          <Box flex={1} pl={4} pr={1} overflow="auto">
            <Canvas
              slide={slides[currentSlideIndex]}
              setSlide={(newSlide) => {
                setSlides(slides.map((s,i) => {
                  if (i===currentSlideIndex) {
                    s = newSlide;
                  }
                  return s;
                }));

                announceSlideChange(currentSlideIndex);
              }}
            />
          </Box>
        </Flex>
      </Container>
    </Flex>
  </>);
}