import React from 'react';

import {
  Stack,
  Button,
  Input,
  Divider,
} from '@chakra-ui/react';

export default function Toolbar({ 
    tool, setTool,
    lineWidth, setLineWidth,
    color, setColor,
    clearCanvas
  }) {
  return (
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
        onClick={clearCanvas}
      >
        clear
      </Button>

      {/*<Button size="sm" variant="outline"
        onClick={() => saveImage()}
      >
        save
      </Button>*/}
    </Stack>
  )
}
