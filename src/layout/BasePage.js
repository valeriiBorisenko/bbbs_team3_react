import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from '../hooks/index';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './BasePage.scss';

function BasePage({
  children,
  headTitle,
  headDescription,
  scrollUpDeps,
  isNoFooter,
  isHeaderTransparentOnTop,
  sectionClassMain,
}) {
  useScrollToTop(scrollUpDeps);

  const classNamesMain = ['main', sectionClassMain].join(' ').trim();

  return (
    <>
      <Helmet>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
      </Helmet>
      <Header isTransparentOnTop={isHeaderTransparentOnTop} />
      <main className={classNamesMain}>{children}</main>
      {!isNoFooter && <Footer />}
    </>
  );
}

BasePage.propTypes = {
  children: PropTypes.node,
  headTitle: PropTypes.string.isRequired,
  headDescription: PropTypes.string.isRequired,
  scrollUpDeps: PropTypes.arrayOf(PropTypes.any),
  isNoFooter: PropTypes.bool,
  isHeaderTransparentOnTop: PropTypes.bool,
  sectionClassMain: PropTypes.string,
};

BasePage.defaultProps = {
  children: null,
  scrollUpDeps: [],
  isNoFooter: false,
  isHeaderTransparentOnTop: false,
  sectionClassMain: '',
};

export default BasePage;
