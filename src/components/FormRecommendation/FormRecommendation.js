/* eslint-disable no-unused-vars */
import './FormRecommendation.scss';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { CitiesContext } from '../../contexts/index';
import { regExpImages, regExpUrl } from '../../config/constants';
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
    photoPlaceholder,
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
    setValues,
    handleChangeFiles,
  } = useFormWithValidation();

  console.log(values);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    // let inputFields = Object.assign(values);
    // if (fileUploaded && userImage) {
    //   inputFields = {
    //     ...inputFields,
    //     image: userImage[0],
    //   };
    // }
    console.log({ values });
    // onSubmit(values);
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
      <div className="form-recom__input-container">
        <Input
          sectionClass="form-recom__input-wrap form-recom__input-wrap_medium form-recom__input-wrap_indentation"
          type="text"
          name="title"
          placeholder={titlePlaceholder}
          required
          minLength="5"
          maxLength="50"
          error={errors?.title}
        />

        <Input
          sectionClass="form-recom__input-wrap form-recom__input-wrap_medium"
          type="text"
          name="link"
          placeholder={linkPlaceholder}
          pattern={regExpUrl}
          error={errors?.link}
        />
      </div>

      <Input
        sectionClass="form-recom__input-wrap"
        type="text"
        name="address"
        placeholder={addressPlaceholder}
        required
        minLength="5"
        maxLength="50"
        error={errors?.address}
      />

      <div className="form-recom__input-container">
        <label className="form-recom__label" htmlFor="formRecommendationBoy">
          <input
            id="formRecommendationBoy"
            className="form-recom__input-radio"
            type="radio"
            name="gender"
            value="male"
          />
          <span
            className={`form-recom__pseudo-radio ${
              errors?.gender ? 'form-recom__pseudo-radio_error' : ''
            }`}
          >
            {genderMale}
          </span>
        </label>
        <label className="form-recom__label" htmlFor="formRecommendationGirl">
          <input
            id="formRecommendationGirl"
            className="form-recom__input-radio"
            type="radio"
            name="gender"
            value="female"
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
          required
          max={25}
          min={1}
          error={errors?.age}
        />
      </div>

      <DropDownSelect
        placeholder={activityPlaceholder}
        options={activityTypes}
        inputName="activityType"
        error={errors?.activityType}
        isFormOpen={isOpen}
      />

      <DropDownSelect
        placeholder={cityPlaceholder}
        options={cities}
        inputName="city"
        error={errors?.city}
        isFormOpen={isOpen}
      />

      <Input
        sectionClass="form-recom__input form-recom__input_textarea"
        type="text"
        name="description"
        placeholder={textAreaPlaceholder}
        required
        maxLength="200"
        error={errors?.description}
        isTextarea
      />

      <div className="form-recom__submit-zone">
        <label htmlFor="formRecomInputUpload">
          <input
            id="formRecomInputUpload"
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            className="form-recom__input-radio"
            onChange={handleChangeFiles}
          />
          <ButtonRound
            sectionClass={`form-recom__add-photo ${
              errors?.image ? 'form-recom__add-photo_error' : ''
            }`}
            color={`${errors?.image ? 'error' : 'lightGray'}`}
            isSmall
            isSpan
          />
        </label>

        <Button title={buttonText} color="blue" isSubmittable />
      </div>
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
