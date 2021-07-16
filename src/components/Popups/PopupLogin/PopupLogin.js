import './PopupLogin.scss';
import { useEffect, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import Lottie from 'lottie-web';
import texts from './locales/RU';
import { CurrentUserContext, ErrorsContext } from '../../../contexts/index';
import { useAuth, useFormWithValidation } from '../../../hooks/index';
import { AFISHA_URL } from '../../../config/routes';
import Popup from '../Popup/Popup';
import { Input, Button, TitleH2 } from '../../utils/index';
import animationSuccess from '../../../assets/animation/ill_popup_success.json';

function PopupLogin({ isOpen, onClose }) {
  const { updateUser } = useContext(CurrentUserContext);
  const { serverError, clearError } = useContext(ErrorsContext);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  function handleSubmitForgotPassword(evt) {
    evt.preventDefault();
    // временное решение имитации отправки
    resetForm();
    clearError();
    setIsSuccess(true);
    setTimeout(successForgotPassword, 8000);
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
        name="usermail"
        placeholder={texts.emailPlaceholder}
        onChange={handleChange}
        value={values?.usermail}
        error={errors?.usermail}
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
    'popup__container_success',
    `${isSuccess ? 'popup__container_success_opened' : ''}`,
  ]
    .join(' ')
    .trim();

  const containerAnimationSuccessLogin = () => (
    <div className={className}>
      <div
        ref={animationContainer}
        className="popup__container_success-animation"
      />
      <TitleH2 title={texts.successTitle} />
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
