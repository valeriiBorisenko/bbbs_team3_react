//! хардкод
// eslint-disable-next-line consistent-return
function renderThoseDamnedLines(dataLength, pageSize, isTablet) {
  const renderOneLine = () => (
    <>
      <div className="cards-section__line" />
    </>
  );

  const renderTwoLines = () => (
    <>
      <div className="cards-section__line" />
      <div className="cards-section__line" />
    </>
  );

  const renderThreeLines = () => (
    <>
      <div className="cards-section__line" />
      <div className="cards-section__line" />
      <div className="cards-section__line" />
    </>
  );

  if (isTablet) {
    if (dataLength < 2) return null;

    if (dataLength < 3) return renderOneLine();

    if (dataLength < 4) return renderTwoLines();

    return renderThreeLines();
  }

  switch (pageSize) {
    case 16: {
      if (dataLength < 5) return null;

      if (dataLength < 9) return renderOneLine();

      if (dataLength < 13) return renderTwoLines();

      return renderThreeLines();
    }

    case 12: {
      if (dataLength < 4) return null;

      if (dataLength < 7) return renderOneLine();

      if (dataLength < 10) return renderTwoLines();

      return renderThreeLines();
    }

    case 9: {
      if (dataLength < 4) return null;

      if (dataLength < 7) return renderOneLine();

      return renderTwoLines();
    }

    default: {
      if (dataLength < 3) return null;

      return renderOneLine();
    }
  }
}

export default renderThoseDamnedLines;
