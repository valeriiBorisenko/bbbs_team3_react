import PropTypes from 'prop-types';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function BasePage({
  children,
  handlers: {
    handleLogout,
    handleUserButtonClick,
    handleClickPopupCities,
    cities
  }
}) {
  return (
    <div className="page">
      <Header
        onLogout={handleLogout}
        onUserButtonClick={handleUserButtonClick}
        onCityChange={handleClickPopupCities}
        cities={cities}
      />
      <main className="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}

BasePage.propTypes = {
  children: PropTypes.node,
  handlers: PropTypes.objectOf(PropTypes.any)
};

BasePage.defaultProps = {
  children: null,
  handlers: {}
};

export default BasePage;
