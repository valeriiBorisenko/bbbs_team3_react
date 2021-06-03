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
  data, sectionClass, isOpen, onCancel
}) {
  const classNames = ['card-container', 'account-form', sectionClass].join(' ').trim();
  const [inputValues, setInputValues] = useState({});
  console.log(inputValues);

  const {
    register, handleSubmit, formState, reset, setValue
  } = useForm({ mode: 'onChange' });
  const { isValid } = formState;

  const onSubmit = (values) => setInputValues({ ...inputValues, ...values });

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
        setValue('title', data.title, {
          shouldValidate: true
        });
        setValue('date', parseDate(data.date), {
          shouldValidate: true
        });
        setValue('description', data.description, {
          shouldValidate: true
        });
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
  }, [isOpen]);

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
        <form name="addStoryForm" className="account-form__form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            name="title"
            placeholder="Место встречи"
            register={register}
            minLength="5"
            maxLength="20"
            required
          />
          <Input
            type="date"
            name="date"
            placeholder="Дата&emsp;"
            sectionClass="account-form__input_el_date"
            register={register}
            required
          />
          <Input
            type="text"
            name="description"
            placeholder="Опишите вашу встречу, какие чувства вы испытывали, что понравилось / не понравилось"
            sectionClass="account-form__input_el_textarea"
            register={register}
            minLength="5"
            required
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
              />
              <Rating
                type="radio"
                name="rating"
                ratingType="neutral"
                value="neutral"
                sectionClass="account-form__rating"
              />
              <Rating
                type="radio"
                name="rating"
                ratingType="bad"
                value="bad"
                sectionClass="account-form__rating"
              />
              <Caption
                title="Оцените проведенное время"
                sectionClass="account-form__ratings-text"
              />
            </div>
            <div className="account-form__buttons">
              <Button
                title="Удалить"
                color="gray-borderless"
                sectionClass="account-form__button_el_delete"
                onClick={onCancel}
              />
              <Button title="Добавить" isSubmittable sectionClass="account-form__button_el_add" isDisabled={!isValid} />
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
  isOpen: PropTypes.bool
};

AccountForm.defaultProps = {
  data: {},
  sectionClass: '',
  onCancel: undefined,
  isOpen: false
};

export default AccountForm;
