import React from 'react';
import rough from 'roughjs';

import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

export default function SessionPage() {
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);

  //const [mousePos, setMousePos] = React.useState({ x:0, y:0 });
  const [isDrawing, setIsDrawing] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth*2;
    canvas.height = canvas.offsetHeight*2;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const context = canvas.getContext('2d');
    context.scale(2,2);
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  return (<>
    <Container maxW="container.lg">
      <Box borderWidth="2px" borderRadius="xl" h="400px">
        <canvas 
          ref={canvasRef}
          style={{ width: "100%", height: "100%" }}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
        />
      </Box>
    </Container>
  </>);
}