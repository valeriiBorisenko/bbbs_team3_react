import React, { useState } from 'react';
import '../Popup/Popup.scss';
import './PopupLogin.scss';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import Popup from '../Popup/Popup';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';

function PopupLogin({ isOpen, onClose, onLoginFormSubmit }) {
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  function submitHandler(event) {
    event.preventDefault();
    onLoginFormSubmit({
      login: loginValue,
      password: passwordValue
    });
  }

  //! аварийный перевод на главную, если не хочешь логиниться
  const history = useHistory();
  const location = useLocation();
  function closePopup() {
    if (location.pathname === '/calendar') {
      history.push('/');
    }
    onClose();
  }

  function handleLoginChange(event) {
    setLoginValue(event.target.value);
  }

  function handlePasswordChange(event) {
    setPasswordValue(event.target.value);
  }

  return (
    <Popup
      type="sign-in"
      typeContainer="sign-in"
      isOpen={isOpen}
      onClose={closePopup}
      onSubmit={submitHandler}
    >
      <TitleH2 sectionClass="popup__title_type_sign-in" title="Вход" />
      <p className="paragraph popup__sign-in">
        Вход в личный кабинет доступен наставникам программы «Старшие Братья
        Старшие Сёстры».
      </p>
      <p className="paragraph popup__sign-in">
        Пожалуйста, введите логин и пароль из письма. Если вам не приходило
        письмо, свяжитесь с вашим куратором.
      </p>
      <input
        type="text"
        className="popup__input"
        required
        placeholder="Логин"
        value={loginValue}
        onChange={handleLoginChange}
      />
      <input
        type="password"
        className="popup__input"
        required
        value={passwordValue}
        onChange={handlePasswordChange}
        placeholder="Пароль"
      />
      <a href="/" className="popup__forgot-password">Забыли пароль?</a>
      <Button
        color="blue"
        title="Войти"
        isSubmittable
        sectionClass="popup__button_type_sign-in"
      />
    </Popup>
  );
}

PopupLogin.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLoginFormSubmit: PropTypes.func.isRequired
};

export default PopupLogin;
