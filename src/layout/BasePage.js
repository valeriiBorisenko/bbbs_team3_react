import PropTypes from 'prop-types';
import Footer from '../components/Footer/Footer';

function BasePage({ children }) {
  return (
    <>
      <main className="main">{children}</main>
      <Footer />
    </>
  );
}

BasePage.propTypes = {
  children: PropTypes.node,
};

BasePage.defaultProps = {
  children: null,
};

export default BasePage;
