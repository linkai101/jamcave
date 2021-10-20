import React from 'react';
//import rough from 'roughjs';

import {
  Box,
  Flex,
  Stack,
  Button,
  Input,
  Divider,
} from '@chakra-ui/react';

export default function Canvas(rest) {
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);

  const [isDrawing, setIsDrawing] = React.useState(false);

  const [elements, setElements] = React.useState([]);
  const [currentPath, setCurrentPath] = React.useState([]);
  const [tool, setTool] = React.useState('brush'); // brush, line, rect, circle, eraser
  const [lineWidth, setLineWidth] = React.useState(2);
  const [color, setColor] = React.useState('black');
  const [lineCap, setLineCap] = React.useState('round');

  // Set canvas size on load
  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.style.width = "100%";
    canvas.style.height = `${canvas.width/16*9}px`;
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.style.width = "100%";
    canvas.style.height = `${canvas.width/16*9}px`;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.scale(1,1);
    contextRef.current = context;
    
    // draw existing elements
    if (elements.length > 0) {
      elements.forEach(ele => {
        contextRef.current.strokeStyle = ele.color;
        contextRef.current.lineWidth = ele.lineWidth;
        contextRef.current.lineCap = ele.lineCap;
        switch (ele.tool) {
          case "brush":
            createBrushStroke(contextRef.current, ele.path);
            break;
          case "line":
            createLineStroke(contextRef.current, ele.path);
            break;
          case "rect":
            createRectStroke(contextRef.current, ele.path);
            break;
          case "circle":
            createCircleStroke(contextRef.current, ele.path);
            break;
        }
      });
    }

    // draw current stroke
    if (currentPath.length > 0) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;
      contextRef.current.lineCap = lineCap;

      switch (tool) {
        case "brush":
          createBrushStroke(contextRef.current, currentPath);
          break;
        case "line":
          createLineStroke(contextRef.current, currentPath);
          break;
        case "rect":
          createRectStroke(contextRef.current, currentPath);
          break;
        case "circle":
          // display dot while drawing (disappears on release)
          contextRef.current.beginPath();
          contextRef.current.lineTo(currentPath[0].x, currentPath[0].y);
          contextRef.current.stroke();
          contextRef.current.closePath();

          createCircleStroke(contextRef.current, currentPath);
          break;
      }
    }
  }, [elements, currentPath]);

  const startDrawing = ({ nativeEvent }) => {
    if (isDrawing) return;
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
    if (!isDrawing) return;
    setElements([...elements, { tool, path: currentPath, color, lineWidth, lineCap }]);
    setCurrentPath([]);
    setIsDrawing(false);
  };

  return (
    <Flex>
      <Box flex={1}
        overflow="hidden"
        borderWidth="2px" borderRadius="xl"
        {...rest}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          //onMouseLeave={finishDrawing}
        />
      </Box>

      <Stack
        w="42px" ml={2} p={1}
        borderWidth="2px" borderRadius="xl"
      >
        <Button size="sm" variant="outline"
          onClick={() => setTool('brush')}
          colorScheme={tool === 'brush' ? "orange" : "gray"}
        >
          🖌️
        </Button>
        <Button size="sm" variant="outline"
          onClick={() => setTool('line')}
          colorScheme={tool === 'line' ? "orange" : "gray"}
        >
          |
        </Button>
        <Button size="sm" variant="outline"
          onClick={() => setTool('rect')}
          colorScheme={tool === 'rect' ? "orange" : "gray"}
        >
          ◻
        </Button>
        <Button size="sm" variant="outline"
          onClick={() => setTool('circle')}
          colorScheme={tool === 'circle' ? "orange" : "gray"}
        >
          ○
        </Button>

        <Divider pt={2} mb={2}/>

        <Input size="xs" value={lineWidth} onChange={e => setLineWidth(parseInt(e.target.value))}/>
        
        <Divider pt={2} mb={2}/>

        <Button size="sm"
          onClick={() => setColor('black')}
          colorScheme={color === 'black' ? "blackAlpha" : "gray"}
        >
          ⚫
        </Button>
        <Button size="sm"
          onClick={() => setColor('blue')}
          colorScheme={color === 'blue' ? "blue" : "gray"}
        >
          🔵
        </Button>
        <Button size="sm"
          onClick={() => setColor('purple')}
          colorScheme={color === 'purple' ? "purple" : "gray"}
        >
          🟣
        </Button>
        
        <Divider pt={2} mb={2}/>

        <Button size="sm" variant="outline"
          onClick={() => setElements([])}
        >
          clear
        </Button>
      </Stack>
    </Flex>
  );
}


function createBrushStroke(ctx, path) {
  if (!path.length > 0) return;
  ctx.beginPath();
  path.forEach((coord) => {
    ctx.lineTo(coord.x, coord.y);
  });
  ctx.stroke();
  ctx.closePath();
}

function createLineStroke(ctx, path) {
  if (!path.length > 0) return;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  ctx.lineTo(path[path.length-1].x, path[path.length-1].y);
  ctx.stroke();
  ctx.closePath();
}

function createCircleStroke(ctx, path) {
  function getDistance(p1, p2) {
    return Math.sqrt(Math.abs(p2.x-p1.x)**2 + Math.abs(p2.y-p1.y)**2);
  }

  if (!path.length > 0) return;
  ctx.beginPath();
  ctx.arc(path[0].x, path[0].y, getDistance(path[0], path[path.length-1]), 0, 2*Math.PI);
  ctx.stroke();
  ctx.closePath();
}

function createRectStroke(ctx, path) {
  if (!path.length > 0) return;
  ctx.beginPath();
  ctx.rect(path[0].x, path[0].y, path[path.length-1].x - path[0].x, path[path.length-1].y - path[0].y);
  ctx.stroke();
  ctx.closePath();
}