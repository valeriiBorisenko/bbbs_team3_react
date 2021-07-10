import './FormRecommendation.scss';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { CitiesContext } from '../../contexts/index';
import { regExpImages } from '../../config/constants';
import { useFormWithValidation } from '../../hooks/index';
import { Input, Button, ButtonRound, DropDownSelect } from '../utils/index';

function FormRecommendation({ isOpen, onSubmit, activityTypes }) {
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
  } = texts;

  const [textAreaPlaceholder, setTextAreaPlaceholder] = useState('');

  useEffect(() => {
    const tablet = window.matchMedia('(max-width: 900px)');

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

  const cities = useContext(CitiesContext);

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
      }, 600);
    } else {
      setIsAnimated(false);
    }
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
      name="formRecomendation"
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
              minLength="5"
              maxLength="50"
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
            sectionClass="form-recom__input-wrap"
            type="text"
            name="address"
            placeholder={addressPlaceholder}
            onChange={handleChange}
            value={values.address}
            required
            minLength="5"
            maxLength="50"
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
              sectionClass="form-recom__input-wrap form-recom__input-wrap_narrow"
              type="number"
              name="age"
              placeholder={agePlaceholder}
              onChange={handleChange}
              value={values.age}
              required
              max="25"
              min="1"
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
            sectionClass="form-recom__input form-recom__input_textarea"
            type="text"
            name="description"
            placeholder={textAreaPlaceholder}
            onChange={handleChange}
            value={values.description}
            required
            maxLength="200"
            error={errors?.description}
            isTextarea
          />

          <div className="form-recom__submit-zone">
            <div className="form-recom__add-photo">
              {errors?.image && (
                <span className="form-recom__add-photo_error">
                  {errors?.image}
                </span>
              )}
              <label htmlFor="formRecomInputUpload">
                <input
                  id="formRecomInputUpload"
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg"
                  className="form-recom__input-radio"
                  onChange={(evt) => handleChangeFiles(evt, regExpImages)}
                  required
                />
                <ButtonRound
                  sectionClass={`form-recom__add-photo-btn ${
                    errors?.image ? 'form-recom__add-photo-btn_error' : ''
                  }`}
                  color={`${errors?.image ? 'error' : 'lightGray'}`}
                  isSmall
                  isSpan
                />
              </label>
            </div>

            <Button
              title={buttonText}
              color="blue"
              isDisabled={!isValid}
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
};

FormRecommendation.defaultProps = {
  activityTypes: [],
  isOpen: false,
  onSubmit: () => {},
};

export default FormRecommendation;
