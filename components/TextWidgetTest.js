import React from 'react';

import {
  Box,
} from '@chakra-ui/react';

export default function TextWidgetTest({ canvasRef, ...rest }) {
  const [pos, setPos] = React.useState({ x:0, y:0 });
  const [size, setSize] = React.useState({ width: 100, height: 100 });
  const [isDragging, setIsDragging] = React.useState(false);

  // translate mouse pos on client to canvas
  const getCanvasPos = (clientPos) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: (clientPos.x-rect.left)/canvas.clientWidth * canvas.width, y: (clientPos.y-rect.top)/canvas.clientHeight * canvas.height };
  } // WORK IN PROGRESS

  const mouseDown = ({ clientX, clientY }) => {
    let canvasPos = getCanvasPos({ x:clientX, y:clientY });
    setPos({ x:canvasPos.x-size.width/2, y:canvasPos.y-size.height/2 });
    setIsDragging(true);
  }
  const mouseMove = ({ clientX, clientY }) => {
    if (!isDragging) return;

    let canvasPos = getCanvasPos({ x:clientX, y:clientY });
    setPos({ x:canvasPos.x-size.width/2, y:canvasPos.y-size.height/2 });
  }
  const mouseUp = () => {
    setIsDragging(false);
  }

  return (<>
    <Box position="absolute"
      width={size.width} height={size.height}
      top={pos.y} left={pos.x}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      bg="orange"
      {...rest}
    ></Box>
  </>);
}
