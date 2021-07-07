import { useEffect, useContext } from 'react';
import './PopupLogin.scss';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CurrentUserContext } from '../../../contexts/index';
import { useAuth } from '../../../hooks/index';
import { AFISHA_URL } from '../../../config/routes';
import { Popup, Input, Button, TitleH2 } from './index';

function PopupLogin({ isOpen, onClose }) {
  const { updateUser } = useContext(CurrentUserContext);
  const { handleLogin } = useAuth(updateUser, onClose);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  function onFormSubmit(values) {
    handleLogin(values);
  }

  //! аварийный перевод на главную, если не хочешь логиниться
  const history = useHistory();
  const { pathname } = useLocation();
  function closePopup() {
    if (pathname === AFISHA_URL) {
      history.push('/');
    }
    onClose();
  }

  useEffect(() => {
    reset();
  }, [isOpen]);

  return (
    <Popup
      type="sign-in"
      typeContainer="sign-in"
      isOpen={isOpen}
      onClose={closePopup}
    >
      <form className="popup__form" onSubmit={handleSubmit(onFormSubmit)}>
        <TitleH2 sectionClass="popup__title_type_sign-in" title="Вход" />
        <p className="paragraph popup__sign-in">
          Вход в личный кабинет доступен наставникам программы «Старшие Братья
          Старшие Сёстры».
        </p>
        <p className="paragraph popup__sign-in">
          Пожалуйста, введите логин и пароль из письма. Если вам не приходило
          письмо, свяжитесь с вашим куратором.
        </p>
        <Input
          sectionClass="popup__input"
          type="text"
          name="username"
          placeholder="Логин"
          register={register}
          required
          error={errors?.username}
          errorMessage="Логин*"
        />
        <Input
          sectionClass="popup__input"
          type="password"
          name="password"
          placeholder="Пароль"
          register={register}
          required
          error={errors?.password}
          errorMessage="Пароль*"
        />
        <a href="/" className="popup__forgot-password">
          Забыли пароль?
        </a>
        <Button
          sectionClass="popup__button_type_sign-in"
          color="blue"
          title="Войти"
          isDisabled={!!(errors.username || errors.password)}
          isSubmittable
        />
      </form>
    </Popup>
  );
}

PopupLogin.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PopupLogin;
