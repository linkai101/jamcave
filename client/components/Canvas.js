import React from 'react';
//import rough from 'roughjs';

import {
  Box,
  Flex,
  useColorMode,
} from '@chakra-ui/react';

import Stroke from '../lib/Stroke';
import createStroke from '../lib/strokes';

import Toolbar from '../components/Toolbar';
import TextWidgetTest from '../components/TextWidgetTest';

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

/*const saveImage = (canvas) => {
  const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

  let a = document.createElement('a');
  a.href = image;
  a.download = "download.png";
  document.body.appendChild(a);
  a.click();
}*/

export default function Canvas({ slide, setSlide, ...rest }) {
  const { colorMode } = useColorMode();
  const windowSize = useWindowSize();

  const { dimensions, strokes } = slide;

  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);

  const [isDrawing, setIsDrawing] = React.useState(false);

  const [currentPath, setCurrentPath] = React.useState([]);
  const [tool, setTool] = React.useState('brush'); // brush, line, rect, circle
  const [lineWidth, setLineWidth] = React.useState(3);
  const [color, setColor] = React.useState('black');
  const [lineCap, setLineCap] = React.useState('round');

  function setStrokes(newStrokes) {
    setSlide(Object.assign({}, slide, { strokes: newStrokes }));
  }

  // translate mouse pos on client to canvas
  const getCanvasPos = (clientPos) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: (clientPos.x-rect.left)/canvas.clientWidth * canvas.width, y: (clientPos.y-rect.top)/canvas.clientHeight * canvas.height };
  }
  
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
    
    // draw existing strokes
    if (strokes.length > 0) {
      strokes.forEach(ele => {
        contextRef.current.strokeStyle = (ele.color === 'black' && colorMode === 'dark') ? 'white'
          : (ele.color === 'white' && colorMode === 'light') ? 'black'
          : ele.color; // optimize color for background if necessary
        //contextRef.current.strokeStyle = ele.color;
        contextRef.current.lineWidth = ele.lineWidth;
        contextRef.current.lineCap = ele.lineCap;
        switch (ele.tool) {
          case "brush":
            createStroke.brush(contextRef.current, ele.path);
            break;
          case "line":
            createStroke.line(contextRef.current, ele.path);
            break;
          case "rect":
            createStroke.rect(contextRef.current, ele.path);
            break;
          case "circle":
            createStroke.circle(contextRef.current, ele.path);
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
          createStroke.brush(contextRef.current, currentPath);
          break;
        case "line":
          createStroke.line(contextRef.current, currentPath);
          break;
        case "rect":
          createStroke.rect(contextRef.current, currentPath);
          break;
        case "circle":
          createStroke.circle(contextRef.current, currentPath);
          break;
      }
    }
  }, [strokes, currentPath, colorMode, windowSize]); // update canvas on new stroke, color mode change, and window resize

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
    setStrokes([...strokes, new Stroke(tool, currentPath, color, lineWidth, lineCap)]);
    setCurrentPath([]);
    setIsDrawing(false);
  };

  return (
    <Flex>
      <Box flex={1}>
        <Box
          overflow="hidden"
          borderWidth="2px" borderRadius="xl"
          position="relative"
          {...rest}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={finishDrawing}
            //onMouseLeave={finishDrawing} stops stroke when mouse exits canvas (disabled)
          />

          {/*<TextWidgetTest
            canvasRef={canvasRef}
            // Work in progress
          />*/}
        </Box>
      </Box>

      <Box>
        <Toolbar
          tool={tool} setTool={setTool}
          lineWidth={lineWidth} setLineWidth={setLineWidth}
          color={color} setColor={setColor}
          clearCanvas={() => setStrokes([])}
        />
      </Box>
    </Flex>
  );
}
