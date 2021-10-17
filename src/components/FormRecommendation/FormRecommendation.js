import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { CitiesContext, ErrorsContext } from '../../contexts';
import { regExpImages } from '../../config/constants';
import { useFormWithValidation } from '../../hooks';
import { placesValidationSettings } from '../../config/validation-settings';
import getServerErrors from '../../utils/form-errors';
import { Button, ButtonRound, DropDownSelect, Input } from '../utils';
import './FormRecommendation.scss';

const {
  titlePlaceholder,
  linkPlaceholder,
  addressPlaceholder,
  genderMale,
  genderFemale,
  agePlaceholder,
  activityPlaceholder,
  cityPlaceholder,
  descPlaceholder,
  descPlaceholderMobile,
  buttonText,
  addPhotoBtnDefault,
  addPhotoBtnChange,
  addPhotoAdded,
  buttonTextLoading,
} = texts;

const animationDelay = 600;
const maxTabletWidth = 900;

function FormRecommendation({
  isOpen,
  onSubmit,
  activityTypes,
  isWaitingResponse,
}) {
  const [textAreaPlaceholder, setTextAreaPlaceholder] = useState('');

  useEffect(() => {
    const tablet = window.matchMedia(`(max-width: ${maxTabletWidth}px)`);

    const listener = () => {
      if (tablet.matches) setTextAreaPlaceholder(descPlaceholderMobile);
      else setTextAreaPlaceholder(descPlaceholder);
    };
    listener();

    tablet.addEventListener('change', listener);

    return () => {
      tablet.removeEventListener('change', listener);
    };
  }, []);

  const { cities } = useContext(CitiesContext);
  const { serverError, clearError } = useContext(ErrorsContext);

  const errorsString = serverError ? getServerErrors(serverError) : '';

  const [isAnimated, setIsAnimated] = useState(false);

  const {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
    handleChangeFiles,
  } = useFormWithValidation();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit(values);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setTimeout(() => {
        setIsAnimated(true);
      }, animationDelay);
    } else {
      setIsAnimated(false);
    }
    clearError();
  }, [isOpen]);

  const formClassNames = [
    'form-recom',
    isOpen ? 'form-recom_opened' : '',
    isAnimated ? 'form-recom_animated' : '',
  ]
    .join(' ')
    .trim();

  return (
    <form
      className={formClassNames}
      name="formRecommendation"
      onSubmit={handleSubmit}
      noValidate
    >
      {isOpen && (
        <>
          <div className="form-recom__input-container">
            <Input
              id="formRecommendTitle"
              sectionClass="form-recom__input-wrap form-recom__input-wrap_medium form-recom__input-wrap_indentation"
              type="text"
              name="title"
              placeholder={titlePlaceholder}
              onChange={handleChange}
              value={values.title}
              required
              minLength={placesValidationSettings.title.minLength}
              maxLength={placesValidationSettings.title.maxLength}
              error={errors?.title}
            />

            <Input
              id="formRecommendLink"
              sectionClass="form-recom__input-wrap form-recom__input-wrap_medium"
              type="text"
              name="link"
              placeholder={linkPlaceholder}
              onChange={handleChange}
              value={values.link}
              error={errors?.link}
            />
          </div>

          <Input
            id="formRecommendAddress"
            sectionClass="form-recom__input-wrap"
            type="text"
            name="address"
            placeholder={addressPlaceholder}
            onChange={handleChange}
            value={values.address}
            required
            minLength={placesValidationSettings.address.minLength}
            maxLength={placesValidationSettings.address.maxLength}
            error={errors?.address}
          />

          <div className="form-recom__input-container">
            <label
              className="form-recom__label"
              htmlFor="formRecommendationBoy"
            >
              <input
                id="formRecommendationBoy"
                className="form-recom__input-radio"
                type="radio"
                name="gender"
                onChange={handleChange}
                value="male"
                required
              />
              <span
                className={`form-recom__pseudo-radio ${
                  errors?.gender ? 'form-recom__pseudo-radio_error' : ''
                }`}
              >
                {genderMale}
              </span>
            </label>
            <label
              className="form-recom__label"
              htmlFor="formRecommendationGirl"
            >
              <input
                id="formRecommendationGirl"
                className="form-recom__input-radio"
                type="radio"
                name="gender"
                onChange={handleChange}
                value="female"
                required
              />
              <span
                className={`form-recom__pseudo-radio ${
                  errors?.gender ? 'form-recom__pseudo-radio_error' : ''
                }`}
              >
                {genderFemale}
              </span>
            </label>

            <Input
              id="formRecommendAge"
              sectionClass="form-recom__input-wrap form-recom__input-wrap_narrow"
              type="number"
              name="age"
              placeholder={agePlaceholder}
              onChange={handleChange}
              value={values.age}
              required
              max={placesValidationSettings.age.max}
              min={placesValidationSettings.age.min}
              error={errors?.age}
            />
          </div>

          <DropDownSelect
            placeholder={activityPlaceholder}
            options={activityTypes}
            inputName="activityType"
            onChange={handleChange}
            error={errors?.activityType}
            isFormOpen={isOpen}
          />

          <DropDownSelect
            placeholder={cityPlaceholder}
            options={cities}
            inputName="city"
            onChange={handleChange}
            error={errors?.city}
            isFormOpen={isOpen}
          />

          <Input
            id="formRecommendDescription"
            sectionClass="form-recom__input form-recom__input_textarea"
            type="text"
            name="description"
            placeholder={textAreaPlaceholder}
            onChange={handleChange}
            value={values.description}
            required
            error={errors?.description}
            isTextarea
          />

          <span className="form-error-message">{errorsString}</span>

          <div className="form-recom__submit-zone">
            <div className="form-recom__add-photo">
              {errors?.image && (
                <span className="form-recom__add-photo-error">
                  {errors?.image}
                </span>
              )}
              <div className="form-recom__add-photo-container">
                {values?.image && (
                  <span className="form-recom__add-photo-span form-recom__add-photo-span_text">
                    {addPhotoAdded}
                  </span>
                )}
                <label
                  className="form-recom__add-photo-label"
                  htmlFor="formRecomInputUpload"
                >
                  <input
                    id="formRecomInputUpload"
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg"
                    className="form-recom__input-radio"
                    onChange={(evt) => handleChangeFiles(evt, regExpImages)}
                    required
                  />
                  {!values?.image && (
                    <ButtonRound
                      sectionClass={`form-recom__add-photo-btn ${
                        errors?.image ? 'form-recom__add-photo-btn_error' : ''
                      }`}
                      color={`${errors?.image ? 'error' : 'lightGray'}`}
                      isSmall
                      isSpan
                    />
                  )}
                  <span
                    className={`form-recom__add-photo-span ${
                      errors?.image ? 'form-recom__add-photo-span_error' : ''
                    }`}
                  >
                    {values?.image ? addPhotoBtnChange : addPhotoBtnDefault}
                  </span>
                </label>
              </div>
            </div>

            <Button
              title={isWaitingResponse ? buttonTextLoading : buttonText}
              color="blue"
              isDisabled={isWaitingResponse || !isValid}
              isSubmittable
            />
          </div>
        </>
      )}
    </form>
  );
}

FormRecommendation.propTypes = {
  activityTypes: PropTypes.arrayOf(PropTypes.object),
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func,
  isWaitingResponse: PropTypes.bool,
};

FormRecommendation.defaultProps = {
  activityTypes: [],
  isOpen: false,
  onSubmit: () => {},
  isWaitingResponse: false,
};

export default FormRecommendation;
