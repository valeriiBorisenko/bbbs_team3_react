import getYouTubeID from 'get-youtube-id';

const parserLinkYoutube = (link = '') => {
  const idVideo = getYouTubeID(link);
  const frameSrc = `https://www.youtube.com/embed/${idVideo}`;
  const imagePreview = `http://img.youtube.com/vi/${idVideo}/maxresdefault.jpg`;

  return { frameSrc, imagePreview };
};

export default parserLinkYoutube;
