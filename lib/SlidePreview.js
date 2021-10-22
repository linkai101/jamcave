
class SlidePreview {
  constructor(slide) {
    this.name = slide?.name;
    this.dimensions = slide?.dimensions || { x: 1280, y: 720 };
  }
}

export default SlidePreview;