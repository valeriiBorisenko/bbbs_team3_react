import './MainTitle.scss';
import PropTypes from 'prop-types';

function MainTitle({ title }) {
  return (
    <h1 className="main-title">{title}</h1>
  );
}

MainTitle.propTypes = {
  title: PropTypes.string.isRequired
};

export default MainTitle;
