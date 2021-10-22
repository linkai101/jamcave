
class Slide {
  constructor(name, dimensions, strokes) {
    this.name = name;
    this.dimensions = dimensions || { x: 1280, y: 720 };
    this.strokes = strokes || [];
  }
}

export default Slide;