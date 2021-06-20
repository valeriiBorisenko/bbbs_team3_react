/* eslint-disable react/jsx-props-no-spreading */
import './AccountForm.scss';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { parseDate } from '../../utils/utils';
import captions from '../../utils/rating-captions';
import { Card, Input, Caption, Rating, Button } from './index';

function AccountForm({ data, sectionClass, isEditMode, isOpen, onCancel, onSubmit }) {
  const classNames = ['card-container', 'account-form', sectionClass].join(' ').trim();

  const [inputValues, setInputValues] = useState({});
  const [caption, setCaption] = useState('');
  const [userImage, setUserImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const onFormSubmit = (values) => {
    let inputFields = Object.assign(values);
    inputFields = {
      ...inputFields,
      rate: inputValues.rate,
      id: inputValues.id,
    };
    if (userImage) {
      inputFields = {
        ...inputFields,
        imageUrl: userImage.imageUrl,
      };
    }
    onSubmit(inputFields);
  };

  const handleChangeRating = (value) => {
    setInputValues({ ...inputValues, rate: value });
  };

  const handleChangeImage = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage({ ...userImage, imageUrl });
    }
  };

  useEffect(() => {
    if (inputValues?.rate) setCaption(captions[inputValues.rate]);
    else setCaption('Оцените проведенное время');
  }, [inputValues.rate]);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setInputValues({ ...inputValues, ...data });
        setUserImage({ imageUrl: data.imageUrl });
        setValue('title', data.title);
        setValue('date', parseDate(data.date));
        setValue('description', data.description);
        setValue('rate', data.rate);
      }
    } else {
      setInputValues({});
      setUserImage(null);
      reset({
        title: '',
        date: '',
        description: '',
      });
    }
  }, [isOpen, data]);

  return (
    <div className={classNames}>
      <Card sectionClass="account-form__photo-upload">
        {userImage && (
          <img
            src={userImage.imageUrl}
            alt={data?.title}
            className="account-form__uploaded-image"
          />
        )}

        <div
          className={`account-form__input-upload ${
            userImage ? 'account-form__input-upload_hidden' : ''
          }`}
        >
          <label htmlFor="input-upload" className="account-form__label-file">
            <input
              id="input-upload"
              type="file"
              name="imageUrl"
              className="account-form__input-file"
              {...register('imageUrl')}
              onChange={(evt) => handleChangeImage(evt.target.files[0])}
            />
            <span className="account-form__pseudo-button" />
          </label>
          <Caption title="Загрузить фото" sectionClass="account-form__caption" />
        </div>
      </Card>

      <Card sectionClass="account-form__form-container">
        <form
          name="addStoryForm"
          className="account-form__form"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Input
            type="text"
            name="title"
            placeholder="Место встречи"
            register={register}
            required
            error={errors?.title}
            errorMessage="Место встречи*"
          />
          <Input
            type="date"
            name="date"
            placeholder="Дата&emsp;"
            sectionClass={`account-form__input_el_date ${
              errors.date ? 'account-form__input_el_date-error' : ''
            }`}
            register={register}
            required
            error={errors?.date}
            errorMessage="Дата*&emsp;"
          />
          <Input
            type="text"
            name="description"
            placeholder="Опишите вашу встречу, какие чувства вы испытывали, что понравилось / не понравилось"
            sectionClass="account-form__input_el_textarea"
            register={register}
            required
            error={errors?.description}
            errorMessage="Опишите вашу встречу, какие чувства вы испытывали, что понравилось / не понравилось*"
            isTextarea
          />
          <div className="account-form__submit-zone">
            <div className="account-form__ratings">
              <Rating
                type="radio"
                name="rating"
                ratingType="good"
                onClick={handleChangeRating}
                value="good"
                sectionClass="account-form__rating"
                checked={inputValues?.rate === 'good'}
              />
              <Rating
                type="radio"
                name="rating"
                ratingType="neutral"
                onClick={handleChangeRating}
                value="neutral"
                sectionClass="account-form__rating"
                checked={inputValues?.rate === 'neutral'}
              />
              <Rating
                type="radio"
                name="rating"
                ratingType="bad"
                onClick={handleChangeRating}
                value="bad"
                sectionClass="account-form__rating"
                checked={inputValues?.rate === 'bad'}
              />
              <Caption
                title={caption}
                sectionClass={`account-form__ratings-text account-form__ratings-text_type_${inputValues.rate}`}
              />
            </div>
            <div className="account-form__buttons">
              <Button
                title={`${isEditMode ? 'Отмена' : 'Удалить'}`}
                color="gray-borderless"
                sectionClass="account-form__button_el_delete"
                onClick={onCancel}
              />
              <Button
                title={`${isEditMode ? 'Сохранить' : 'Добавить'}`}
                sectionClass="account-form__button_el_add"
                isDisabled={!!(errors.title || errors.date || errors.description)}
                isSubmittable
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

AccountForm.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  sectionClass: PropTypes.string,
  onCancel: PropTypes.func,
  isOpen: PropTypes.bool,
  isEditMode: PropTypes.bool,
  onSubmit: PropTypes.func,
};

AccountForm.defaultProps = {
  data: {},
  sectionClass: '',
  onCancel: () => {},
  isOpen: false,
  isEditMode: false,
  onSubmit: () => {},
};

export default AccountForm;
