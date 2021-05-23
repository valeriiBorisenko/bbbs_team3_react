import './CardPlace.scss';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import Rubric from '../Rubric/Rubric';
// import TitleH2 from '../TitleH2/TitleH2';
// import Card from '../Card/Card';
// import Caption from '../Caption/Caption';

function CardPlace({
  data
}) {
  console.log(data);
  return (
  // <Card sectionClass={sectionClass} color={color}>

  //   {chosen && <Rubric title="Выбор наставника" sectionClass="card-place__rubric" />}

  //   <div className="card-place__title-wrap">
  //     <Link to="/place" className="card-place__link-wrap">
  //       <TitleH2 sectionClass="card-place__title" title={title} />
  //     </Link>
  //     <Caption sectionClass="card-place__name" title={name} />
  //   </div>

  //   {chosen && (
  //     <Link
  //       to="/place"
  //       className="card-place__link-wrap card-place__link-wrap_content_article-img"
  //     >
  //       <img src={imageUrl} alt={title} className="card-place__image" />
  //     </Link>
  //   )}

    //   <a
    //     href={link}
    //     className="link card-place__link"
    //     target="_blank"
    //     rel="noopener noreferrer"
    //   >
    //     перейти на сайт
    //   </a>
    // </Card>
    <p>{data.res.data.dataMain.title}</p>
  );
}

CardPlace.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired
};

export default CardPlace;
