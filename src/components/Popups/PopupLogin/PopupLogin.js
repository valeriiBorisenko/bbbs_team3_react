/* eslint-disable consistent-return */
import './PopupLogin.scss';
import { useEffect, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import Lottie from 'lottie-web';
import texts from './locales/RU';
import { CurrentUserContext, ErrorsContext } from '../../../contexts/index';
import { useAuth, useFormWithValidation } from '../../../hooks/index';
import { AFISHA_URL } from '../../../config/routes';
import { ERROR_MESSAGES, ERROR_CODES } from '../../../config/constants';
import { recoverPassword } from '../../../api/user';
import Popup from '../Popup/Popup';
import { Input, Button, TitleH2 } from '../../utils/index';
import animationSuccess from '../../../assets/animation/ill_popup_success.json';

function PopupLogin({ isOpen, onClose }) {
  const { updateUser } = useContext(CurrentUserContext);
  const { serverError, clearError, setError } = useContext(ErrorsContext);
  const { generalErrorMessage } = ERROR_MESSAGES;
  const { badRequest } = ERROR_CODES;

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const animationContainer = useRef(null);

  useEffect(() => {
    Lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationSuccess,
    });
  }, []);

  const errorsString = serverError
    ? Object.values(serverError)
        .map((err) => err)
        .join(' ')
        .trim()
    : '';

  const { handleLogin } = useAuth(updateUser);
  function handleClickForgotPassword() {
    setIsForgotPassword(!isForgotPassword);
  }

  function successForgotPassword() {
    setIsSuccess(false);
    setIsForgotPassword(false);
  }

  const { values, handleChange, errors, isValid, resetForm } =
    useFormWithValidation();

  function handleSubmit(evt) {
    evt.preventDefault();
    handleLogin(values);
  }

  function handleError(err) {
    if (err?.status === badRequest) setError(err?.data);
    else setError({ message: generalErrorMessage.title });
  }

  function handleSubmitForgotPassword(evt) {
    evt.preventDefault();
    recoverPassword(values)
      .then((res) => {
        setSuccessMessage(res?.email);
        resetForm();
        clearError();
        setIsSuccess(true);
        setTimeout(successForgotPassword, 6000);
      })
      .catch(handleError);
  }

  //! аварийный перевод на главную, если не хочешь логиниться
  const history = useHistory();
  const { pathname } = useLocation();

  function closePopup() {
    if (pathname === AFISHA_URL) {
      history.push('/');
    }
    setSuccessMessage('');
    onClose();
  }

  function closePopupOnEsc(evt) {
    if (evt.key === 'Escape') {
      closePopup();
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keyup', closePopupOnEsc);
      return () => window.removeEventListener('keyup', closePopupOnEsc);
    }
  }, [pathname, isOpen]);

  useEffect(() => {
    resetForm();
    clearError();
  }, [isOpen, isForgotPassword]);

  useEffect(() => {
    setIsForgotPassword(false);
  }, [isOpen]);

  const classNameAuth = [
    'popup__form',
    'popup__form_type_sign-in',
    `${isOpen && !isForgotPassword ? 'popup__form_type_sign-in_opened' : ''}`,
  ]
    .join(' ')
    .trim();

  const formAuth = () => (
    <form
      className={classNameAuth}
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
        minLength="4"
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

      <button
        className="popup__forgot-password"
        type="button"
        onClick={handleClickForgotPassword}
      >
        {texts.forgotButtonText}
      </button>
      <span className="form-error-message">{errorsString}</span>
      <Button
        sectionClass="popup__button_type_sign-in"
        color="blue"
        title={texts.submitButtonText}
        isDisabled={!isValid}
        isSubmittable
      />
    </form>
  );

  const classForgotPassword = [
    'popup__form',
    'popup__form_type_email',
    `${isForgotPassword && !isSuccess ? 'popup__form_type_email_opened' : ''}`,
  ]
    .join(' ')
    .trim();

  const formForgotPassword = () => (
    <form
      className={classForgotPassword}
      onSubmit={(evt) => handleSubmitForgotPassword(evt)}
      noValidate
    >
      <TitleH2
        sectionClass="popup__title_type_sign-in"
        title={texts.titleForgotForm}
      />
      <p className="paragraph popup__sign-in">{texts.paragraphForgotForm}</p>

      <Input
        id="loginUseremailInput"
        sectionClass="popup__input"
        type="email"
        name="email"
        placeholder={texts.emailPlaceholder}
        onChange={handleChange}
        value={values?.email}
        error={errors?.email}
        required
      />
      <button
        className="popup__forgot-password"
        type="button"
        onClick={handleClickForgotPassword}
      >
        {texts.backButtonText}
      </button>
      <span className="form-error-message">{errorsString}</span>
      <Button
        sectionClass="popup__button_type_sign-in"
        color="blue"
        title={texts.submitButtonTextForgot}
        isDisabled={!isValid}
        isSubmittable
      />
    </form>
  );

  const className = [
    'popup__login-container_success',
    `${isSuccess ? 'popup__login-container_success_opened' : ''}`,
  ]
    .join(' ')
    .trim();

  const containerAnimationSuccessLogin = () => (
    <div className={className}>
      <div
        ref={animationContainer}
        className="popup__login-container_success-animation"
      />
      <TitleH2 title={successMessage} />
    </div>
  );

  return (
    <Popup
      type="sign-in"
      typeContainer="sign-in"
      isOpen={isOpen}
      onClose={closePopup}
    >
      {formAuth()}
      {formForgotPassword()}
      {containerAnimationSuccessLogin()}
    </Popup>
  );
}

PopupLogin.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PopupLogin;
