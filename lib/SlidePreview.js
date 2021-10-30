import { v4 as uuidv4 } from 'uuid';

class SlidePreview {
  constructor(slide) {
    this.id = slide?.id;
    this.name = slide?.name;
    this.dimensions = slide?.dimensions || { x: 1280, y: 720 };
  }
}

export default SlidePreview;