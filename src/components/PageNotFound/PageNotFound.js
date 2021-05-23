// import PropTypes from 'prop-types';
import './PageNotFound.scss';
import { Link } from 'react-router-dom';
import shapes from '../../assets/page-not-found-shapes.svg';
import TitleH2 from '../ui/TitleH2/TitleH2';

function PageNotFound() {
  return (
    <div className="page-not-found">
      <img src={shapes} alt="фигурки" className="page-not-found__picture" />
      <h1 className="page-not-found__title">404</h1>
      <TitleH2
        title="К сожалению, запрашиваемая страница не найдена. Попробуйте перейти на главную страницу"
        sectionClass="page-not-found__subtitle"
      />
      <Link
        className="button page-not-found__link button_color_blue"
        to="/"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}

export default PageNotFound;