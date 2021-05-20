/* eslint-disable dot-notation */
import './MainPage.scss';
import { Link } from 'react-router-dom';
import CardStub from '../ui/CardStub/CardStub';
/* файл для имитации прихода даты с сервера */
import MainPageData from '../../utils/constants';
/*------------------------------------------*/

function MainPage() {
  const data = MainPageData;
  console.log(data);
  return (
    <section className="lead page__section">
      <article className="card-container card-container_type_identical">
        <CardStub />
        <article className="lead__media" key={data['history']['id']}>
          <img
            src={data['history']['imageUrl']}
            alt={data['history']['title']}
            className="card__media-img"
          />
          <Link to="/stories" className="lead__link">
            {data['history']['title']}
          </Link>
        </article>
      </article>
    </section>
  );
}

export default MainPage;
