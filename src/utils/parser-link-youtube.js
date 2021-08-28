import getYouTubeID from 'get-youtube-id';

const parserLinkYoutube = (link) => {
  if (link) {
    const idVideo = getYouTubeID(link);
    const frameSrc = `https://www.youtube.com/embed/${idVideo}`;
    const imagePreview = `http://img.youtube.com/vi/${idVideo}/maxresdefault.jpg`;

    return { frameSrc, imagePreview };
  }
  return '';
};

export default parserLinkYoutube;
