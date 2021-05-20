import './Widget.scss';
import PropTypes from 'prop-types';

function Widget({ link, title }) {
  return (
    <div className="widget">
      <iframe
        className="widget__iframe"
        title={title}
        src={link}
        scrolling="no"
        allowFullScreen="true"
        allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  );
}

Widget.propTypes = {
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default Widget;
