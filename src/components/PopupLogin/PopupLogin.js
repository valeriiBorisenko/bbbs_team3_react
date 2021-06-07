import { useEffect } from 'react';
import './PopupLogin.scss';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Popup from '../Popup/Popup';
import Input from '../ui/Input/Input';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';

function PopupLogin({ isOpen, onClose, onLoginFormSubmit }) {
  const {
    register, handleSubmit, formState: { errors }, reset
  } = useForm();

  function onFormSubmit(values) {
    onLoginFormSubmit(values);
  }

  //! аварийный перевод на главную, если не хочешь логиниться
  const history = useHistory();
  const location = useLocation();
  function closePopup() {
    if (location.pathname === '/afisha') {
      history.push('/');
    }
    onClose();
  }

  useEffect(() => {
    reset({
      login: '',
      password: ''
    });
  }, [isOpen]);

  return (
    <Popup
      type="sign-in"
      typeContainer="sign-in"
      isOpen={isOpen}
      onClose={closePopup}
      onSubmit={handleSubmit(onFormSubmit)}
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
      <Input
        sectionClass="popup__input"
        type="text"
        name="login"
        placeholder="Логин"
        register={register}
        required
        error={errors?.login}
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
      <a href="/" className="popup__forgot-password">Забыли пароль?</a>
      <Button
        sectionClass="popup__button_type_sign-in"
        color="blue"
        title="Войти"
        isDisabled={!!(errors.login || errors.password)}
        isSubmittable
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
