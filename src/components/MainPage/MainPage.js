import './MainPage.scss';
import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import Card from '../ui/Card/Card';
// import CardStub from '../ui/CardStub/CardStub';
// import CardCalendar from '../ui/CardCalendar/CardCalendar';
import CardPlace from '../ui/CardPlace/CardPlace';
import CardAnnotation from '../ui/CardAnnotation/CardAnnotation';
// import CardArticleBig from '../ui/CardArticleBig/CardArticleBig';
// import CardFilm from '../ui/CardFilm/CardFilm';
// import CardVideoMain from '../ui/CardVideoMain/CardVideoMain';
// import Widget from '../ui/Widget/Widget';
// import CardQuestion from '../ui/CardQuestion/CardQuestion';
// import { dataMain } from '../../utils/constants';
import getMainPageData from '../../utils/api';

function MainPage() {
  const [data, setDataMain] = useState();
  useEffect(() => {
    getMainPageData()
      .then((res) => setDataMain(res))
      .catch((err) => alert(err));
  }, [setDataMain]);
  return (data
    ? (
      <>
        {console.log('im rendering')}
        {console.log(data)}
        {console.log(data.data.dataMain.place)}
        {/* <section className="lead page__section">
        <div className="card-container card-container_type_identical">
          {!isAuthorized ? (
            <CardCalendar
              data={data}
            />
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
      </section> */}

        <section className="place main-section page__section">
          <div className="card-container card-container_type_main-article">
            <CardPlace
              isChosen={data.data.dataMain.place.chosen}
              title={data.data.dataMain.place.title}
              name={data.data.dataMain.place.name}
              imageUrl={data.data.dataMain.place.imageUrl}
              link={data.data.dataMain.place.link}
              color="yellow"
              sectionClass="card-place_main"
            />
            <CardAnnotation
            // info={dataMain.place.info}
            // description={dataMain.place.description}
              isMain
            />
          </div>
        </section>

        {/* <section
        className="articles main-section page__section"
        key={dataMain.articles[0].id}
      >
        <Link to="/articles" className="main-section__link">
          <CardArticleBig
            color={dataMain.articles[0].color}
            title={dataMain.articles[0].title}
          />
        </Link>
      </section>

      <section
      className="movies main-section page__section cards-grid cards-grid_content_small-cards">
        {dataMain.movies.map((item) => (
          <Link
            to="/films"
            className="main-section__link card-pagination_page_main"
            key={item.id}
          >
            <CardFilm
              imageUrl={item.imageUrl}
              title={item.title}
              info={item.info}
              link={item.link}
              tags={item.tags}
            />
          </Link>
        ))}
      </section>

      <section className="video main-section page__section">
        <Link
          to="/video"
          key={dataMain.video.id}
          className="main-section__link"
        >
          <CardVideoMain
            title={dataMain.video.title}
            info={dataMain.video.info}
            link={dataMain.video.link}
            imageUrl={dataMain.video.imageUrl}
            duration={dataMain.video.duration}
          />
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
                key={item.id}
              >
                <CardQuestion title={item.title} tags={item.tags} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="articles main-section page__section"
        key={dataMain.articles[1].id}
      >
        <Link to="/articles" className="main-section__link">
          <CardArticleBig
            color={dataMain.articles[1].color}
            title={dataMain.articles[1].title}
          />
        </Link>
      </section> */}
      </>
    ) : <p>Loading</p>
  );
}

// MainPage.propTypes = {
//   // isAuthorized: PropTypes.bool
// };

// MainPage.defaultProps = {
//   isAuthorized: false
// };

export default MainPage;
