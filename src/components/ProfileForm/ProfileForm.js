/* eslint-disable react/jsx-props-no-spreading */
import './ProfileForm.scss';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { parseDate } from '../../utils/utils';
import captions from '../../utils/rating-captions';
import { adminUrl } from '../../config/config';
import { regExpImages } from '../../config/constants';
import { Card, Input, Caption, Rating, Button } from './index';

function ProfileForm({
  data,
  sectionClass,
  isEditMode,
  isOpen,
  onClose,
  onSubmit,
}) {
  const classNames = ['card-container', 'profile-form', sectionClass]
    .join(' ')
    .trim();

  const [inputValues, setInputValues] = useState({});
  const [caption, setCaption] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

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
      mark: inputValues.mark,
      id: inputValues.id,
    };
    if (fileUploaded && userImage.image) {
      inputFields = {
        ...inputFields,
        image: userImage.image,
      };
    }
    onSubmit(inputFields);
    setFileUploaded(false);
  };

  const handleChangeRating = (value) => {
    setInputValues({ ...inputValues, mark: value });
  };

  const handleChangeImage = (file) => {
    if (file && regExpImages.test(file.name)) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage({ ...userImage, image: file, imageUrl });
      setFileUploaded(true);
    } else setValue('image', null);
  };

  useEffect(() => {
    if (inputValues?.mark) setCaption(captions[inputValues.mark]);
    else setCaption('Оцените проведенное время');
  }, [inputValues.mark]);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setInputValues({ ...inputValues, ...data });
        setUserImage({ image: data.image });
        setValue('place', data.place);
        setValue('date', parseDate(data.date));
        setValue('description', data.description);
        setValue('mark', data.mark);
        console.log(data);
      }
    } else {
      setInputValues({});
      setUserImage(null);
      reset({
        place: '',
        date: '',
        description: '',
        mark: '',
      });
    }
  }, [isOpen, data]);

  return (
    <form
      name="addStoryForm"
      onSubmit={handleSubmit(onFormSubmit)}
      className={classNames}
    >
      <Card sectionClass="profile-form__photo-upload">
        {userImage && (
          <img
            src={userImage.imageUrl || `${adminUrl}/media/${userImage.image}`}
            alt={data?.place}
            className="profile-form__uploaded-image"
          />
        )}

        <div
          className={`profile-form__input-upload ${
            userImage ? 'profile-form__input-upload_hidden' : ''
          }`}
        >
          <label htmlFor="input-upload" className="profile-form__label-file">
            {isEditMode ? (
              <input
                id="input-upload"
                type="file"
                accept="image/png, image/jpeg"
                name="image"
                className="profile-form__input-file"
                onChange={(evt) => handleChangeImage(evt.target.files[0])}
              />
            ) : (
              <input
                id="input-upload"
                type="file"
                accept="image/png, image/jpeg"
                name="image"
                className="profile-form__input-file"
                {...register('image', { required: 'Загрузить фото' })}
                onChange={(evt) => handleChangeImage(evt.target.files[0])}
              />
            )}
            <span className="profile-form__pseudo-button" />
          </label>
          <Caption
            title="Загрузить фото"
            sectionClass="profile-form__caption"
          />
        </div>
      </Card>

      <Card sectionClass="profile-form__text-container">
        <div className="profile-form__texts">
          <Input
            type="text"
            name="place"
            placeholder="Место встречи"
            register={register}
            required
            error={errors?.place}
            errorMessage="Место встречи*"
          />
          <Input
            type="date"
            name="date"
            placeholder="Дата&emsp;"
            sectionClass={`profile-form__input_el_date ${
              errors.date ? 'profile-form__input_el_date-error' : ''
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
            sectionClass="profile-form__input_el_textarea"
            register={register}
            required
            error={errors?.description}
            errorMessage="Опишите вашу встречу, какие чувства вы испытывали, что понравилось / не понравилось*"
            isTextarea
          />
          <div className="profile-form__submit-zone">
            <div className="profile-form__ratings">
              <Rating
                type="radio"
                name="rating"
                ratingType="good"
                onClick={handleChangeRating}
                value="good"
                sectionClass="profile-form__rating"
                checked={data?.mark === 'good'}
              />
              <Rating
                type="radio"
                name="rating"
                ratingType="neutral"
                onClick={handleChangeRating}
                value="neutral"
                sectionClass="profile-form__rating"
                checked={data?.mark === 'neutral'}
              />
              <Rating
                type="radio"
                name="rating"
                ratingType="bad"
                onClick={handleChangeRating}
                value="bad"
                sectionClass="profile-form__rating"
                checked={data?.mark === 'bad'}
              />
              <Caption
                title={caption}
                sectionClass={`profile-form__ratings-text profile-form__ratings-text_type_${inputValues.mark}`}
              />
            </div>
            <div className="profile-form__buttons">
              <Button
                title={`${isEditMode ? 'Отмена' : 'Удалить'}`}
                color="gray-borderless"
                sectionClass="profile-form__button_el_delete"
                onClick={onClose}
              />
              <Button
                title={`${isEditMode ? 'Сохранить' : 'Добавить'}`}
                sectionClass="profile-form__button_el_add"
                isDisabled={
                  !!(errors.place || errors.date || errors.description)
                }
                isSubmittable
              />
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
}

ProfileForm.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  sectionClass: PropTypes.string,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  isEditMode: PropTypes.bool,
  onSubmit: PropTypes.func,
};

ProfileForm.defaultProps = {
  data: {},
  sectionClass: '',
  onClose: () => {},
  isOpen: false,
  isEditMode: false,
  onSubmit: () => {},
};

export default ProfileForm;
