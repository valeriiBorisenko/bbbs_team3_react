import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NextArticleLink.scss';

function NextArticleLink({ text, href, sectionClass }) {
  const classNames = ['next-article-link', sectionClass].join(' ').trim();
  return (
    <Link className={classNames} to={href}>
      <span className="next-article-link__text">{text}</span>
      <svg
        className="next-article-link__arrow"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5916 0L30 14.3793L15.5318 30H13.4987L23.3441 19.3448C25.5145 17.1724 24.9357 15.3103 22.1865 15.1552H0V13.6034H22.0418C24.791 13.4483 25.3698 11.8966 23.6334 9.72414L14.5659 0H16.5916Z"
          fill="#224CFF"
        />
      </svg>
    </Link>
  );
}

NextArticleLink.propTypes = {
  text: PropTypes.string,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  sectionClass: PropTypes.string,
};

NextArticleLink.defaultProps = {
  text: 'Link',
  href: '/',
  sectionClass: '',
};

export default NextArticleLink;
