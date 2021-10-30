import { v4 as uuidv4 } from 'uuid';

class Slide {
  constructor(name, dimensions, strokes) {
    this.id = uuidv4();
    this.name = name;
    this.dimensions = dimensions || { x: 1280, y: 720 };
    this.strokes = strokes || [];
  }
}

export default Slide;