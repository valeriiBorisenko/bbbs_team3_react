/* eslint-disable dot-notation */
import './MainPage.scss';
import { Link } from 'react-router-dom';
import CardStub from '../ui/CardStub/CardStub';
import CardPlace from '../ui/CardPlace/CardPlace';
import CardAnnotation from '../ui/CardAnnotation/CardAnnotation';
/* файл для имитации прихода даты с сервера */
import MainPageData from '../../utils/constants';
/*------------------------------------------*/

function MainPage() {
  const data = MainPageData;
  return (
    <>
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

      <section className="main-section page__section">
        <article
          className="card-container card-container_type_main-article"
          key={data['place']['id']}
        >
          <CardPlace
            isChosen={data['place']['chosen']}
            title={data['place']['title']}
            name={data['place']['name']}
            imageUrl={data['place']['imageUrl']}
            link={data['place']['link']}
          />
          <CardAnnotation
            isChosen={data['place']['chosen']}
            info={data['place']['info']}
            description={data['place']['description']}
          />
        </article>
      </section>
    </>
  );
}

export default MainPage;
