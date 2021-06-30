/* eslint-disable react/jsx-props-no-spreading */
import './FormRecommendation.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useActivityTypes, useCities } from '../../hooks/index';
import { regExpImages, regExpUrl } from '../../config/constants';
import { Input, Button, ButtonRound } from './index';

function FormRecommendation({ isOpen, onSubmit }) {
  const textAreaPlaceholder =
    window.innerWidth < 576
      ? 'Комментарий*'
      : 'Комментарий* Поделитесь впечатлениями о проведенном времени';

  const activityTypes = useActivityTypes();
  const cities = useCities();

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
        <div className="form-recom__input-wrap form-recom__input-wrap_indentation">
          <Input
            sectionClass="form-recom__input"
            type="text"
            name="title"
            placeholder="Название*"
            register={register}
            required
            minLength={{ value: 5, message: 'Минимальная длина 5 символов' }}
            maxLength={{ value: 50, message: 'Максимальная длина 50 символов' }}
            error={errors?.title}
            errorMessage="Название*"
          />
          {errors?.title && (
            <span className="form-recom__input-error">
              {errors?.title?.message}
            </span>
          )}
        </div>

        <div className="form-recom__input-wrap">
          <Input
            sectionClass="form-recom__input"
            type="text"
            name="link"
            placeholder="Сайт"
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
          placeholder="Адрес*"
          register={register}
          required
          minLength={{ value: 5, message: 'Минимальная длина 5 символов' }}
          maxLength={{ value: 50, message: 'Максимальная длина 50 символов' }}
          error={errors?.address}
          errorMessage="Адрес*"
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
            Мальчик
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
            Девочка
          </span>
        </label>
        <div className="form-recom__input-wrap">
          <Input
            sectionClass="form-recom__input"
            type="number"
            name="age"
            placeholder="Возраст*"
            register={register}
            required
            max={{ value: 25, message: 'Максимальный возраст 25 лет' }}
            min={{ value: 1, message: 'Минимальный возраст 1 год' }}
            error={errors?.age}
            errorMessage="Возраст*"
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
        {...register('activityType', { required: 'Тип отдыха*' })}
      >
        <option value="" className="form-recom__option" hidden>
          Тип отдыха*
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
        {...register('city', { required: 'Город*' })}
      >
        <option value="" className="form-recom__option" hidden>
          Город*
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
            {...register('image', { required: 'Добавить фото' })}
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

        <Button title="Отправить" color="blue" isSubmittable />
      </div>
    </form>
  );
}

FormRecommendation.propTypes = {
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func,
};

FormRecommendation.defaultProps = {
  isOpen: false,
  onSubmit: () => {},
};

export default FormRecommendation;
