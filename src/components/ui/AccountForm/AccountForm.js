/* eslint-disable react/jsx-props-no-spreading */
import './AccountForm.scss';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { parseDate } from '../../../utils/utils';
import Card from '../Card/Card';
import Input from '../Input/Input';
import Caption from '../Caption/Caption';
import Rating from '../Rating/Rating';
import Button from '../Button/Button';

function AccountForm({
  data, sectionClass, isEditMode, isOpen, onCancel, inputValues, setInputValues
}) {
  const classNames = ['card-container', 'account-form', sectionClass].join(' ').trim();
  // const [inputValues, setInputValues] = useState({});
  const [caption, setCaption] = useState('');
  // console.log({ inputValues });

  const {
    register, handleSubmit, formState: { errors }, reset, setValue
  } = useForm();

  const onFormSubmit = (values) => {
    setInputValues({ ...inputValues, ...values });
  };

  // рейтинг встречи
  const handleChangeRating = (evt) => {
    const { target } = evt;
    setInputValues({ ...inputValues, rate: target.value });
  };

  useEffect(() => {
    if (inputValues?.rate === 'good') setCaption('Было классно');
    if (inputValues?.rate === 'neutral') setCaption('Нормально');
    if (inputValues?.rate === 'bad') setCaption('Что-то пошло не так');
    if (!inputValues?.rate) setCaption('Оцените проведенное время');
  }, [inputValues.rate]);

  // добавление картинки
  const [userImage, setUserImage] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      setUserImage(
        { imageUrl: URL.createObjectURL(acceptedFiles[0]) }
      );
    }
  }, []);

  const { getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop
  });

  useEffect(() => {
    setInputValues({ ...inputValues, ...userImage });
  }, [userImage]);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setInputValues({ ...inputValues, ...data });
        setUserImage(
          { imageUrl: data.imageUrl }
        );
        setValue('title', data.title);
        setValue('date', parseDate(data.date));
        setValue('description', data.description);
      }
    } else {
      setInputValues({});
      setUserImage(null);
      reset({
        title: '',
        date: '',
        description: ''
      });
    }
  }, [isOpen, data]);

  return (
    <div className={classNames}>
      <Card sectionClass="account-form__photo-upload">
        {userImage && <img src={userImage.imageUrl} alt={data?.title} className="account-form__uploaded-image" />}

        <div className={`account-form__input-upload ${userImage ? 'account-form__input-upload_hidden' : ''}`}>
          <label htmlFor="input-upload" className="account-form__label-file">
            <input
              id="input-upload"
              className="account-form__input-file"
              {...getInputProps()}
            />
            <span className="account-form__pseudo-button" />
          </label>
          <Caption title="Загрузить фото" sectionClass="account-form__caption" />
        </div>
      </Card>

      <Card sectionClass="account-form__form-container">
        <form name="addStoryForm" className="account-form__form" onSubmit={handleSubmit(onFormSubmit)}>
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
            sectionClass={`account-form__input_el_date ${errors.date ? 'account-form__input_el_date-error' : ''}`}
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
                value="good"
                sectionClass="account-form__rating"
                onClick={handleChangeRating}
                checked={inputValues.rate === 'good'}
              />
              <Rating
                type="radio"
                name="rating"
                ratingType="neutral"
                value="neutral"
                sectionClass="account-form__rating"
                onClick={handleChangeRating}
                checked={inputValues.rate === 'neutral'}
              />
              <Rating
                type="radio"
                name="rating"
                ratingType="bad"
                value="bad"
                sectionClass="account-form__rating"
                onClick={handleChangeRating}
                checked={inputValues.rate === 'bad'}
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
  inputValues: PropTypes.objectOf(PropTypes.any),
  setInputValues: PropTypes.func
};

AccountForm.defaultProps = {
  data: {},
  sectionClass: '',
  onCancel: undefined,
  isOpen: false,
  isEditMode: false,
  onSubmit: undefined,
  inputValues: {},
  setInputValues: undefined
};

export default AccountForm;
