import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';

function PageNoFooter({ children, headTitle, headDescription }) {
  return (
    <>
      <Helmet>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
      </Helmet>
      <Header />
      <main className="main">{children}</main>
    </>
  );
}

PageNoFooter.propTypes = {
  children: PropTypes.node,
  headTitle: PropTypes.string.isRequired,
  headDescription: PropTypes.string.isRequired,
};

PageNoFooter.defaultProps = {
  children: null,
};

export default PageNoFooter;
