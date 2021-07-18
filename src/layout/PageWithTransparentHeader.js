import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function PageWithTransparentHeader({ children, headTitle, headDescription }) {
  return (
    <>
      <Helmet>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
      </Helmet>
      <Header isTransparent />
      <main className="main">{children}</main>
      <Footer />
    </>
  );
}

PageWithTransparentHeader.propTypes = {
  children: PropTypes.node,
  headTitle: PropTypes.string.isRequired,
  headDescription: PropTypes.string.isRequired,
};

PageWithTransparentHeader.defaultProps = {
  children: null,
};

export default PageWithTransparentHeader;
