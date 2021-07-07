import './Widget.scss';
import PropTypes from 'prop-types';

function Widget({ link, title }) {
  return (
    <iframe
      className="widget-facebook"
      title={title}
      src={link}
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    />
  );
}

Widget.propTypes = {
  link: PropTypes.string,
  title: PropTypes.string,
};

Widget.defaultProps = {
  link: '#',
  title: '',
};

export default Widget;
