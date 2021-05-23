import './Widget.scss';
import PropTypes from 'prop-types';
import Card from '../Card/Card';

function Widget({ link, title }) {
  return (
    <Card sectionClass="widget" color="blue">
      <iframe
        className="widget__iframe"
        title={title}
        src={link}
        scrolling="no"
        allowFullScreen="true"
        allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </Card>
  );
}

Widget.propTypes = {
  link: PropTypes.string,
  title: PropTypes.string
};

Widget.defaultProps = {
  link: '#',
  title: ''
};

export default Widget;
