/*
  Data sent from the client to the host
*/

import { v4 as uuidv4 } from 'uuid';

class ClientDataTransfer {
  constructor(type, options, id) {
    this.id = id || uuidv4();
    this.type = type;

    let formattedOptions = {};
    switch(type) {
      case "request": { // request data from host
        const { currentSlideIndex } = options;
        formattedOptions.currentSlideIndex = currentSlideIndex;
        break;
      }
      case "slide": { // send updated slide data to host
        const { slide, currentSlideIndex } = options;
        formattedOptions.slide = slide;
        formattedOptions.currentSlideIndex = currentSlideIndex;
        break;
      }
      case "previews": { // send updated previews to host
        const { slidePreviews } = options;
        formattedOptions.slidePreviews = slidePreviews;
        break;
      }
      case "createSlide": { // request host to create new blank slide
        break;
      }
      case "deleteSlide": {
        const { slideIndex } = options;
        formattedOptions.slideIndex = slideIndex;
      }
      case "message": {
        const { content } = options;
        formattedOptions.content = content;
        break;
      }
    }
    this.options = formattedOptions;
  }
}

export default ClientDataTransfer;