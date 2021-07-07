//! хардкод
// eslint-disable-next-line consistent-return
function renderThoseDamnedLines(dataLength, pageSize) {
  if (window.innerWidth < 901) {
    if (dataLength < 2) {
      return null;
    }
    if (dataLength < 3) {
      return (
        <>
          <div className="cards-section__line" />
        </>
      );
    }
    if (dataLength < 4) {
      return (
        <>
          <div className="cards-section__line" />
          <div className="cards-section__line" />
        </>
      );
    }
    return (
      <>
        <div className="cards-section__line" />
        <div className="cards-section__line" />
        <div className="cards-section__line" />
      </>
    );
  }

  switch (pageSize) {
    case 16: {
      if (dataLength < 5) {
        return null;
      }
      if (dataLength < 9) {
        return <div className="cards-section__line" />;
      }

      if (dataLength < 13) {
        return (
          <>
            <div className="cards-section__line" />
            <div className="cards-section__line" />
          </>
        );
      }
      return (
        <>
          <div className="cards-section__line" />
          <div className="cards-section__line" />
          <div className="cards-section__line" />
        </>
      );
    }
    case 9: {
      if (dataLength < 4) {
        return null;
      }
      if (dataLength < 7) {
        return <div className="cards-section__line" />;
      }
      return (
        <>
          <div className="cards-section__line" />
          <div className="cards-section__line" />
        </>
      );
    }
    default: {
      if (dataLength < 3) {
        return null;
      }

      return <div className="cards-section__line" />;
    }
  }
}

export default renderThoseDamnedLines;
