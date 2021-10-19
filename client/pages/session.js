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

  const [isDrawing, setIsDrawing] = React.useState(false);

  const [elements, setElements] = React.useState([]);
  const [currentPath, setCurrentPath] = React.useState([]);
  const [currentTool, setCurrentTool] = React.useState('pen'); // pen, line, rect, circle, eraser
  const [brushSize, setBrushSize] = React.useState(8);
  const [color, setColor] = React.useState('black');
  const [brushStyle, setBrushStyle] = React.useState('round');

  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth*2;
    canvas.height = canvas.offsetHeight*2;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(2,2);
    contextRef.current = context;

    //const rc = rough.canvas(canvas);

    elements.forEach(ele => {
      contextRef.current.strokeStyle = ele.color;
      contextRef.current.lineWidth = ele.brushSize;
      contextRef.current.lineCap = ele.brushStyle;
      switch (ele.tool) {
        case "pen":
            contextRef.current.beginPath();
            ele.path.forEach((coord) => {
              contextRef.current.lineTo(coord.x, coord.y);
            });
            contextRef.current.stroke();
            contextRef.current.closePath();
          break;
      }
    });

    if (currentPath.length > 0) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
      contextRef.current.lineCap = brushStyle;

      contextRef.current.beginPath();
      currentPath.forEach(point => {
        contextRef.current.lineTo(point.x, point.y);
        contextRef.current.stroke();
      });
      contextRef.current.closePath();
    }
  }, [elements, currentPath]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setCurrentPath([{ x: offsetX, y: offsetY }]);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    setCurrentPath([...currentPath, { x: offsetX, y: offsetY }]);
  };

  const finishDrawing = () => {
    setElements([...elements, { tool: currentTool, path: currentPath, color, brushSize, brushStyle }]);
    //setCurrentPath([]);
    setIsDrawing(false);
  };

  return (<>
    <Container maxW="container.lg">
      <Box borderWidth="2px" borderRadius="xl" h="400px">
        <canvas 
          ref={canvasRef}
          style={{ width: "100%", height: "100%" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
        />
      </Box>
    </Container>
  </>);
}

