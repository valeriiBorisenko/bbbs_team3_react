import './Header.scss';
import PropTypes from 'prop-types';
import NavBar from '../ui/NavBar/NavBar';

function Header({ isAuthorized, handleUserButtonClick }) {
  // липкий хедер
  let prevScrollpos = 0;
  window.addEventListener('scroll', () => {
    const currentScrollPos = window.pageYOffset;
    // если prevScrollpos больше currentScrollPos значит мы скролим наверх уже
    if (prevScrollpos > currentScrollPos) {
      document.querySelector('.header').classList.add('header__on-scroll-up');
    } else {
      document.querySelector('.header').classList.remove('header__on-scroll-up');
    }

    if (currentScrollPos === 0) {
      document.querySelector('.header').classList.remove('header__on-scroll-up');
    }
    prevScrollpos = currentScrollPos;
  });

  return (
    <header className="header page__section">
      <NavBar isAuthorized={isAuthorized} handleUserButtonClick={handleUserButtonClick} />
    </header>
  );
}

Header.propTypes = {
  isAuthorized: PropTypes.bool,
  handleUserButtonClick: PropTypes.func
};

Header.defaultProps = {
  isAuthorized: false,
  handleUserButtonClick: undefined
};

export default Header;
