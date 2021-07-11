const parserLinkYoutube = (link) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

  if (link) {
    const match = link.match(regExp);
    const idVideo = match && match[7].length === 11 ? match[7] : '';
    const frameSrc = `https://www.youtube.com/embed/${idVideo}`;

    // Нужно ли нам превью к видео?
    // const imagePreview = `http://img.youtube.com/vi/${idVideo}/maxresdefault.jpg`;

    return frameSrc;
  }
  // По хорошому ставить заглушку когда нету ссылки или ссылка не подходит
  return null;
};

export default parserLinkYoutube;
