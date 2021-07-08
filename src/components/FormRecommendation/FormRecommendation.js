/* eslint-disable react/jsx-props-no-spreading */
import './FormRecommendation.scss';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import texts from './locales/RU';
import { CitiesContext } from '../../contexts/index';
import { regExpImages, regExpUrl } from '../../config/constants';
import { Input, Button, ButtonRound } from '../utils/index';

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
  const textAreaPlaceholder =
    window.innerWidth < 576 ? descPlaceholderMobile : descPlaceholder;

  const cities = useContext(CitiesContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm();

  const [isAnimated, setIsAnimated] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleChangeImage = (files) => {
    if (files[0] && regExpImages.test(files[0].name)) {
      setUserImage(files);
      setFileUploaded(true);
      clearErrors('image');
    } else if (!fileUploaded) {
      setValue('image', null);
    } else {
      setValue('image', userImage);
    }
  };

  const onFormSubmit = (values) => {
    let inputFields = Object.assign(values);
    if (fileUploaded && userImage) {
      inputFields = {
        ...inputFields,
        image: userImage[0],
      };
    }
    onSubmit(inputFields);
    setFileUploaded(false);
  };

  useEffect(() => {
    if (isOpen) {
      reset();
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
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
    >
      <div className="form-recom__input-container">
        <div className="form-recom__input-wrap form-recom__input-wrap_meduim form-recom__input-wrap_indentation">
          <Input
            sectionClass="form-recom__input"
            type="text"
            name="title"
            placeholder={titlePlaceholder}
            register={register}
            required
            minLength={{ value: 5, message: 'Минимальная длина 5 символов' }}
            maxLength={{ value: 50, message: 'Максимальная длина 50 символов' }}
            error={errors?.title}
            errorMessage={titlePlaceholder}
          />
          {errors?.title && (
            <span className="form-recom__input-error">
              {errors?.title?.message}
            </span>
          )}
        </div>

        <div className="form-recom__input-wrap form-recom__input-wrap_meduim">
          <Input
            sectionClass="form-recom__input"
            type="text"
            name="link"
            placeholder={linkPlaceholder}
            register={register}
            pattern={{
              value: regExpUrl,
              message: 'Введена некорректная ссылка',
            }}
          />
          {errors?.link && (
            <span className="form-recom__input-error">
              {errors?.link?.message}
            </span>
          )}
        </div>
      </div>

      <div className="form-recom__input-wrap">
        <Input
          sectionClass="form-recom__input"
          type="text"
          name="address"
          placeholder={addressPlaceholder}
          register={register}
          required
          minLength={{ value: 5, message: 'Минимальная длина 5 символов' }}
          maxLength={{ value: 50, message: 'Максимальная длина 50 символов' }}
          error={errors?.address}
          errorMessage={addressPlaceholder}
        />
        {errors?.address && (
          <span className="form-recom__input-error">
            {errors?.address?.message}
          </span>
        )}
      </div>

      <div className="form-recom__input-container">
        <label className="form-recom__label" htmlFor="formRecommendationBoy">
          <input
            id="formRecommendationBoy"
            className="form-recom__input-radio"
            type="radio"
            name="gender"
            {...register('gender', { required: 'male' })}
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
            {...register('gender', { required: 'female' })}
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
        <div className="form-recom__input-wrap form-recom__input-wrap_narrow">
          <Input
            sectionClass="form-recom__input"
            type="number"
            name="age"
            placeholder={agePlaceholder}
            register={register}
            required
            max={{ value: 25, message: 'Макс. возраст 25 лет' }}
            min={{ value: 1, message: 'Мин. возраст 1 год' }}
            error={errors?.age}
            errorMessage={agePlaceholder}
          />
          {errors?.age && (
            <span className="form-recom__input-error">
              {errors?.age?.message}
            </span>
          )}
        </div>
      </div>

      <select
        className={`form-recom__select ${
          errors?.activityType ? 'form-recom__select_error' : ''
        }`}
        name="activityType"
        {...register('activityType', { required: activityPlaceholder })}
      >
        <option value="" className="form-recom__option" hidden>
          {activityPlaceholder}
        </option>
        {activityTypes &&
          activityTypes.map(({ id, name }) => (
            <option key={id} value={id} className="form-recom__option">
              {name}
            </option>
          ))}
      </select>

      <select
        className={`form-recom__select ${
          errors?.city ? 'form-recom__select_error' : ''
        }`}
        name="city"
        {...register('city', { required: cityPlaceholder })}
      >
        <option value="" className="form-recom__option" hidden>
          {cityPlaceholder}
        </option>
        {cities &&
          cities.map(({ id, name }) => (
            <option key={id} value={id} className="form-recom__option">
              {name}
            </option>
          ))}
      </select>

      <div className="form-recom__input-wrap">
        <Input
          sectionClass="form-recom__input form-recom__input_textarea"
          type="text"
          name="description"
          placeholder={textAreaPlaceholder}
          register={register}
          required
          maxLength={{ value: 200, message: 'Максимальная длина 200 символов' }}
          error={errors?.description}
          errorMessage={textAreaPlaceholder}
          isTextarea
        />
        {errors?.description && (
          <span className="form-recom__input-error">
            {errors?.description?.message}
          </span>
        )}
      </div>

      <div className="form-recom__submit-zone">
        <label htmlFor="formRecomInputUpload">
          <input
            id="formRecomInputUpload"
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            className="form-recom__input-radio"
            {...register('image', { required: photoPlaceholder })}
            onChange={(evt) => handleChangeImage(evt.target.files)}
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
