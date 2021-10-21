import React from 'react';
//import rough from 'roughjs';

import {
  Box,
  Flex,
  Stack,
  Button,
  Input,
  Divider,
  useColorMode,
} from '@chakra-ui/react';

// get window size (for updating canvas size)
function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: undefined,
    height: undefined,
  });
  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export default function Canvas({ dimensions, elements, setElements, ...rest }) {
  const { colorMode } = useColorMode();
  const windowSize = useWindowSize();

  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);

  const [isDrawing, setIsDrawing] = React.useState(false);

  const [currentPath, setCurrentPath] = React.useState([]);
  const [tool, setTool] = React.useState('brush'); // brush, line, rect, circle, eraser*
  const [lineWidth, setLineWidth] = React.useState(3);
  const [color, setColor] = React.useState('black');
  const [lineCap, setLineCap] = React.useState('round');

  // Set canvas size on load
  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.style.width = "100%";
    canvas.style.height = `${canvas.clientWidth/canvas.width*canvas.height}px`;
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = dimensions.x;
    canvas.height = dimensions.y;
    canvas.style.width = "100%";
    canvas.style.height = `${canvas.clientWidth/canvas.width*canvas.height}px`;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.scale(1,1);
    contextRef.current = context;
    
    // draw existing elements
    if (elements.length > 0) {
      elements.forEach(ele => {
        contextRef.current.strokeStyle = (ele.color === 'black' && colorMode === 'dark') ? 'white'
          : (ele.color === 'white' && colorMode === 'light') ? 'black'
          : ele.color; // optimize color for background if necessary
        //contextRef.current.strokeStyle = ele.color;
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
      contextRef.current.strokeStyle = (color === 'black' && colorMode === 'dark') ? 'white' 
        : (color === 'white' && colorMode === 'light') ? 'black'
        : color; // optimize color for background if necessary
      //contextRef.current.strokeStyle = color;
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
          /*// display dot while drawing (disappears on release)
          contextRef.current.beginPath();
          contextRef.current.lineTo(currentPath[0].x, currentPath[0].y);
          contextRef.current.stroke();
          contextRef.current.closePath();*/

          createCircleStroke(contextRef.current, currentPath);
          break;
      }
    }
  }, [elements, currentPath, colorMode, windowSize]); // update canvas on new element, color mode change, and window resize

  // translate mouse pos on client to canvas
  const getCanvasPos = (clientPos) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: (clientPos.x-rect.left)/canvas.clientWidth * canvas.width, y: (clientPos.y-rect.top)/canvas.clientHeight * canvas.height };
  }

  // handle drawing events
  const startDrawing = ({ clientX, clientY }) => {
    if (isDrawing) return;
    setCurrentPath([getCanvasPos({ x: clientX, y: clientY })]);
    setIsDrawing(true);
  };
  const draw = ({ clientX, clientY }) => {
    if (!isDrawing) return;
    setCurrentPath([...currentPath, getCanvasPos({ x: clientX, y: clientY })]);
  };
  const finishDrawing = () => {
    if (!isDrawing) return;
    setElements([...elements, { tool, path: currentPath, color, lineWidth, lineCap }]);
    setCurrentPath([]);
    setIsDrawing(false);
  };

  return (
    <Flex>
      <Box flex={1}>
        <Box
          overflow="hidden"
          borderWidth="2px" borderRadius="xl"
          {...rest}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={finishDrawing}
            //onMouseLeave={finishDrawing} stops stroke when mouse exits canvas (disabled)
          />
        </Box>
      </Box>

      <Box>
        <Stack
          w="42px" ml={2} p={1}
          //borderWidth="2px" borderRadius="xl"
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
            onClick={() => setColor('green')}
            colorScheme={color === 'green' ? "green" : "gray"}
          >
            🟢
          </Button>
          
          <Divider pt={2} mb={2}/>

          <Button size="sm" variant="outline"
            onClick={() => setElements([])}
          >
            clear
          </Button>

          {/*<Button size="sm" variant="outline"
            onClick={() => saveImage()}
          >
            save
          </Button>*/}
        </Stack>
      </Box>
    </Flex>
  );

  /*function saveImage() {
    const image = canvasRef.current.toDataURL("image/png").replace("image/png", "image/octet-stream");

    let a = document.createElement('a');
    a.href = image;
    a.download = "download.png";
    document.body.appendChild(a);
    a.click();
  }*/
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
