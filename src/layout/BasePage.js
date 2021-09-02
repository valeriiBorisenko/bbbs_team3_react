import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from '../hooks/index';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function BasePage({ children, headTitle, headDescription }) {
  useScrollToTop();

  return (
    <>
      <Helmet>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
      </Helmet>
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </>
  );
}

BasePage.propTypes = {
  children: PropTypes.node,
  headTitle: PropTypes.string.isRequired,
  headDescription: PropTypes.string.isRequired,
};

BasePage.defaultProps = {
  children: null,
};

export default BasePage;
