import './Main.scss';
import PropTypes from 'prop-types';

function Main({ children }) {
  return (
    <main>
      {children}
    </main>
  );
}

Main.propTypes = {
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node
};

export default Main;
