/*
  Data sent from the host to the client
*/

import { v4 as uuidv4 } from 'uuid';

class HostDataTransfer {
  constructor(type, options, id) {
    this.id = id || uuidv4();
    this.type = type;
    
    let formattedOptions = {};
    switch(type) {
      case "slide": { // send data to client
        const { slides, currentSlideIndex } = options;
        formattedOptions.slide = slides[currentSlideIndex];
        break;
      }
      case "slideChange": { // announce slide change (client will request if slide is needed)
        const { changedSlideIndex } = options;
        formattedOptions.changedSlideIndex = changedSlideIndex;
        break;
      }
      case "slideDeletion": { // announce slide deletion (tell client to adjust currentSlideIndex accordingly, assuming client previews already synced)
        const { slideIndex } = options;
        formattedOptions.slideIndex = slideIndex;
        break;
      }
      case "previews": { // send previews to client
        const { slidePreviews } = options;
        formattedOptions.slidePreviews = slidePreviews;
        break;
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

export default HostDataTransfer;