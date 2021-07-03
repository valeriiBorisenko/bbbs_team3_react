import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function BasePage({ children, title, description }) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Header />
      <main className="main">{children}</main>
      <Footer />
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
