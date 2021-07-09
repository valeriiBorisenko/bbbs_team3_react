import './PopupLogin.scss';
import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import texts from './locales/RU';
import { CurrentUserContext } from '../../../contexts/index';
import { useAuth, useFormWithValidation } from '../../../hooks/index';
import { AFISHA_URL } from '../../../config/routes';
import Popup from '../Popup/Popup';
import { Input, Button, TitleH2 } from '../../utils/index';

function PopupLogin({ isOpen, onClose }) {
  const { updateUser } = useContext(CurrentUserContext);
  const { handleLogin } = useAuth(updateUser, onClose);

  const { values, handleChange, errors, isValid, resetForm } =
    useFormWithValidation();

  function handleSubmit(evt) {
    evt.preventDefault();
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
    resetForm();
  }, [isOpen]);

  return (
    <Popup
      type="sign-in"
      typeContainer="sign-in"
      isOpen={isOpen}
      onClose={closePopup}
    >
      <form
        className="popup__form"
        onSubmit={(evt) => handleSubmit(evt)}
        noValidate
      >
        <TitleH2 sectionClass="popup__title_type_sign-in" title={texts.title} />
        <p className="paragraph popup__sign-in">{texts.firstParagraph}</p>
        <p className="paragraph popup__sign-in">{texts.secondParagraph}</p>

        <Input
          id="loginUsernameInput"
          sectionClass="popup__input"
          type="text"
          name="username"
          placeholder={texts.loginPlaceholder}
          onChange={handleChange}
          value={values?.username}
          error={errors?.username}
          minLength="2"
          required
        />

        <Input
          id="loginPasswordInput"
          sectionClass="popup__input"
          type="password"
          name="password"
          placeholder={texts.passwordPlaceholder}
          onChange={handleChange}
          value={values?.password}
          error={errors?.password}
          minLength="8"
          required
        />

        <a href="/" className="popup__forgot-password">
          {texts.forgotButtonText}
        </a>
        <Button
          sectionClass="popup__button_type_sign-in"
          color="blue"
          title={texts.submitButtonText}
          isDisabled={!isValid}
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
