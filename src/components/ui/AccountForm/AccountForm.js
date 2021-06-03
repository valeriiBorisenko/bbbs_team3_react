/* eslint-disable no-unused-vars */
import './AccountForm.scss';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { parseDate } from '../../../utils/utils';
import Card from '../Card/Card';
import Input from '../Input/Input';
import InputFileUpload from '../InputFileUpload/InputFileUpload';
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

  const onSubmit = (values) => setInputValues(values);

  // загрузка фото в контейнер
  const imageContainerRef = useRef();
  const [isImgUploaded, setIsImgUploaded] = useState(false);

  const handleImageUpload = (evt) => {
    const { target } = evt;
    const file = target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        setIsImgUploaded(true);
        imageContainerRef.current.textContent = '';
        imageContainerRef.current.style.backgroundImage = 'url()';
        imageContainerRef.current.append(img);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageContainerRef && imageContainerRef.current) {
      if (isOpen) {
        if (data) {
          setInputValues(data);
          setIsImgUploaded(true);
          setValue('title', data.title, {
            shouldValidate: true
          });
          setValue('date', parseDate(data.date), {
            shouldValidate: true
          });
          setValue('description', data.description, {
            shouldValidate: true
          });
          imageContainerRef.current.style.backgroundImage = `url(${data.imageUrl})`;
        }
      } else {
        setInputValues({});
        setIsImgUploaded(false);
        imageContainerRef.current.textContent = '';
        imageContainerRef.current.style.backgroundImage = 'url()';
        reset({
          title: '',
          date: '',
          description: ''
        });
      }
    }
  }, [isOpen, setInputValues, imageContainerRef.current]);

  return (
    <div className={classNames}>
      <Card sectionClass="account-form__photo-upload">
        <div className="account-form__image-container" ref={imageContainerRef} />
        <div className={`account-form__input-upload-container ${isImgUploaded ? 'account-form__input-upload-container_hidden' : ''}`}>
          <InputFileUpload
            name="image"
            onChange={handleImageUpload}
          />
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
