import './PopupLogin.scss';
import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import texts from './locales/RU';
import { CurrentUserContext } from '../../../contexts/index';
import { useAuth } from '../../../hooks/index';
import { AFISHA_URL } from '../../../config/routes';
import Popup from '../Popup/Popup';
import { Input, Button, TitleH2 } from '../../utils/index';

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
        <TitleH2 sectionClass="popup__title_type_sign-in" title={texts.title} />
        <p className="paragraph popup__sign-in">{texts.firstParagraph}</p>
        <p className="paragraph popup__sign-in">{texts.secondParagraph}</p>
        <Input
          sectionClass="popup__input"
          type="text"
          name="username"
          placeholder={texts.loginPlaceholder}
          register={register}
          required
          error={errors?.username}
          errorMessage={`${texts.loginPlaceholder}*`}
        />
        <Input
          sectionClass="popup__input"
          type="password"
          name="password"
          placeholder={texts.passwordPlaceholder}
          register={register}
          required
          error={errors?.password}
          errorMessage={`${texts.passwordPlaceholder}*`}
        />
        <a href="/" className="popup__forgot-password">
          {texts.forgotButtonText}
        </a>
        <Button
          sectionClass="popup__button_type_sign-in"
          color="blue"
          title={texts.submitButtonText}
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
