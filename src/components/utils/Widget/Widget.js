import './Widget.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';

function Widget({ link, title }) {
  return (
    <div className="widget">
      <iframe
        className="widget__iframe"
        title={title}
        src={link}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
      <p className="widget__stub">{texts.textStub}</p>
    </div>
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
