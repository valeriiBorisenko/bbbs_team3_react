import './MainPage.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '../ui/Card/Card';
import CardStub from '../ui/CardStub/CardStub';
import CardCalendar from '../ui/CardCalendar/CardCalendar';
import CardPlaceMain from '../ui/CardPlaceMain/CardPlaceMain';
import CardArticleBig from '../ui/CardArticleBig/CardArticleBig';
import CardFilm from '../ui/CardFilm/CardFilm';
import CardVideoMain from '../ui/CardVideoMain/CardVideoMain';
import Widget from '../ui/Widget/Widget';
import CardQuestion from '../ui/CardQuestion/CardQuestion';
import getMainPageData from '../../utils/api';

function MainPage({ isAuthorized }) {
  const [dataMain, setDataMain] = useState(null);
  useEffect(() => {
    getMainPageData()
      .then((res) => setDataMain(res.data.mainPageData))
      .catch((err) => console.log(err));
  }, [setDataMain]);
  return dataMain ? (
    <>
      <section className="lead page__section">
        <div className="card-container card-container_type_identical">
          {isAuthorized ? (
            <CardCalendar key={dataMain.event.id} data={dataMain.event} />
          ) : (
            <CardStub />
          )}
          <Card sectionClass="lead__media" key={dataMain.history.id}>
            <img
              src={dataMain.history.imageUrl}
              alt={dataMain.history.title}
              className="card__media-img"
            />
            <Link to="/stories" className="lead__link">
              {dataMain.history.title}
            </Link>
          </Card>
        </div>
      </section>

      <section className="place main-section page__section">
        <CardPlaceMain
          key={dataMain.place.id}
          data={dataMain.place}
          color="yellow"
          sectionClass="card-place_main"
        />
      </section>

      <section className="articles main-section page__section">
        <Link to="/articles" className="main-section__link">
          <CardArticleBig
            key={dataMain.articles[0].id}
            data={dataMain.articles[0]}
          />
        </Link>
      </section>

      <section className="movies main-section page__section cards-grid cards-grid_content_small-cards">
        {dataMain.movies.map((item) => (
          <Link
            to="/films"
            className="main-section__link card-pagination_page_main"
          >
            <CardFilm key={item.id} data={item} />
          </Link>
        ))}
      </section>

      <section className="video main-section page__section">
        <Link to="/video" className="main-section__link">
          <CardVideoMain key={dataMain.video.id} data={dataMain.video} />
        </Link>
      </section>

      <section className="main-questions main-section page__section">
        <div className="card-container card-container_type_iframe">
          <Widget
            title="Facebook"
            link="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook&tabs=timeline&width=630&height=630&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
          />
          <div className="main-questions__container">
            {dataMain.questions.map((item) => (
              <Link
                to="/questions"
                className="main-section__link main-section__link_el_question"
              >
                <CardQuestion key={item.id} data={item} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="articles main-section page__section">
        <Link to="/articles" className="main-section__link">
          <CardArticleBig
            key={dataMain.articles[1].id}
            data={dataMain.articles[1]}
          />
        </Link>
      </section>
    </>
  ) : (
    <p style={{ color: 'red', margin: '0 auto', textAlign: 'center' }}>Loading</p>
  );
}

MainPage.propTypes = {
  isAuthorized: PropTypes.bool
};

MainPage.defaultProps = {
  isAuthorized: false
};

export default MainPage;
