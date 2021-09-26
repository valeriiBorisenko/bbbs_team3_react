import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import Lottie from 'lottie-web';
import texts from './locales/RU';
import { CurrentUserContext, ErrorsContext } from '../../../contexts';
import { useAuth, useFormWithValidation } from '../../../hooks';
import getServerErrors from '../../../utils/form-errors';
import { AFISHA_URL } from '../../../config/routes';
import { ERROR_CODES, ERROR_MESSAGES } from '../../../config/constants';
import { recoverPassword } from '../../../api/user';
import Popup from '../Popup/Popup';
import { Button, Input, TitleH2 } from '../../utils';
import animationSuccess from '../../../assets/animation/ill_popup_recommend-success.json';
import './PopupLogin.scss';

const {
  title,
  firstParagraph,
  secondParagraph,
  loginPlaceholder,
  passwordPlaceholder,
  forgotButtonText,
  submitButtonText,
  titleForgotForm,
  paragraphForgotForm,
  emailPlaceholder,
  backButtonText,
  submitButtonTextForgot,
  loadingButtonTextLogin,
  loadingButtonTextForgot,
} = texts;

const validationSettings = {
  username: {
    maxLength: 150,
  },
  password: {
    minLength: 8,
  },
};

function PopupLogin({ isOpen, onClose }) {
  const { updateUser } = useContext(CurrentUserContext);
  const { serverError, clearError, setError } = useContext(ErrorsContext);
  const { generalErrorMessage } = ERROR_MESSAGES;
  const { badRequest } = ERROR_CODES;

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
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

  const errorsString = serverError ? getServerErrors(serverError) : '';

  const { handleLogin, isWaitingResponse } = useAuth(updateUser);

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
    setIsRecoveringPassword(true);
    evt.preventDefault();
    recoverPassword(values)
      .then((res) => {
        setSuccessMessage(res?.email);
        resetForm();
        clearError();
        setIsSuccess(true);
        setTimeout(successForgotPassword, 6000);
      })
      .catch(handleError)
      .finally(() => setIsRecoveringPassword(false));
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

  // eslint-disable-next-line consistent-return
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

  const classForgotPassword = [
    'popup__form',
    'popup__form_type_email',
    `${isForgotPassword && !isSuccess ? 'popup__form_type_email_opened' : ''}`,
  ]
    .join(' ')
    .trim();

  const classNameSuccess = [
    'popup__login-container_success',
    `${isSuccess ? 'popup__login-container_success_opened' : ''}`,
  ]
    .join(' ')
    .trim();

  return (
    <Popup
      type="sign-in"
      typeContainer="sign-in"
      isOpen={isOpen}
      onClose={closePopup}
    >
      {renderFormAuth()}
      {renderFormForgotPassword()}
      {renderSuccessLoginContainer()}
    </Popup>
  );

  function renderFormAuth() {
    return (
      <form
        className={classNameAuth}
        onSubmit={(evt) => handleSubmit(evt)}
        noValidate
      >
        <TitleH2 sectionClass="popup__title_type_sign-in" title={title} />
        <p className="paragraph popup__sign-in">{firstParagraph}</p>
        <p className="paragraph popup__sign-in">{secondParagraph}</p>

        <Input
          id="loginUsernameInput"
          sectionClass="popup__input"
          type="text"
          name="username"
          placeholder={loginPlaceholder}
          onChange={handleChange}
          value={values?.username}
          error={errors?.username}
          maxLength={validationSettings.username.maxLength}
          required
        />

        <Input
          id="loginPasswordInput"
          sectionClass="popup__input"
          type="password"
          name="password"
          placeholder={passwordPlaceholder}
          onChange={handleChange}
          value={values?.password}
          error={errors?.password}
          minLength={validationSettings.password.minLength}
          required
        />

        <button
          className="popup__forgot-password"
          type="button"
          onClick={handleClickForgotPassword}
        >
          {forgotButtonText}
        </button>
        <span className="form-error-message">{errorsString}</span>
        <Button
          sectionClass="popup__button_type_sign-in"
          color="blue"
          title={isWaitingResponse ? loadingButtonTextLogin : submitButtonText}
          isDisabled={isWaitingResponse || !isValid}
          isSubmittable
        />
      </form>
    );
  }

  function renderFormForgotPassword() {
    return (
      <form
        className={classForgotPassword}
        onSubmit={(evt) => handleSubmitForgotPassword(evt)}
        noValidate
      >
        <TitleH2
          sectionClass="popup__title_type_sign-in"
          title={titleForgotForm}
        />
        <p className="paragraph popup__sign-in">{paragraphForgotForm}</p>

        <Input
          id="loginUseremailInput"
          sectionClass="popup__input"
          type="email"
          name="email"
          placeholder={emailPlaceholder}
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
          {backButtonText}
        </button>
        <span className="form-error-message">{errorsString}</span>
        <Button
          sectionClass="popup__button_type_sign-in"
          color="blue"
          title={
            isRecoveringPassword
              ? loadingButtonTextForgot
              : submitButtonTextForgot
          }
          isDisabled={isRecoveringPassword || !isValid}
          isSubmittable
        />
      </form>
    );
  }

  function renderSuccessLoginContainer() {
    return (
      <div className={classNameSuccess}>
        <div
          ref={animationContainer}
          className="popup__login-container_success-animation"
        />
        <TitleH2 title={successMessage} />
      </div>
    );
  }
}

PopupLogin.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PopupLogin;
