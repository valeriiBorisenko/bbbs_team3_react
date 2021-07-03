import PropTypes from 'prop-types';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { PopupLogin, PopupCities } from '../components/Popups/index';

function BasePage({ children, title, description }) {
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);

  function togglePopupCities() {
    setIsPopupCitiesOpen(!isPopupCitiesOpen);
  }

  function openPopupLogin() {
    setIsPopupLoginOpen(true);
  }

  function closePopupLogin() {
    setIsPopupLoginOpen(false);
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Header
        openPopupLogin={openPopupLogin}
        closePopupLogin={closePopupLogin}
        onCityChange={togglePopupCities}
      />
      <main className="main">{children}</main>
      <Footer />
      <PopupLogin isOpen={isPopupLoginOpen} onClose={closePopupLogin} />
      <PopupCities isOpen={isPopupCitiesOpen} onClose={togglePopupCities} />
    </>
  );
}

BasePage.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

BasePage.defaultProps = {
  children: null,
};

export default BasePage;
