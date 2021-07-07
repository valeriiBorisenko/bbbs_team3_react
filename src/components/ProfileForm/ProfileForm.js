/* eslint-disable react/jsx-props-no-spreading */
import './ProfileForm.scss';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import texts from './locales/RU';
import { parseDate } from '../../utils/utils';
import captions from '../../utils/rating-captions';
import { staticImageUrl } from '../../config/config';
import { regExpImages } from '../../config/constants';
import {
  Card,
  Input,
  Caption,
  Rating,
  Button,
  ButtonRound,
} from '../utils/index';

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

  const handleFocusDataInput = (evt) => {
    // eslint-disable-next-line no-param-reassign
    evt.currentTarget.type = 'date';
  };

  const handleChangeRating = (value) => {
    setInputValues({ ...inputValues, mark: value });
  };

  const handleChangeImage = (file) => {
    if (file && regExpImages.test(file.name)) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage({ ...userImage, image: file, imageUrl });
      setFileUploaded(true);
    }
  };

  const handleCloseForm = () => {
    setInputValues({});
    setUserImage(null);
    reset();
    onClose();
  };

  useEffect(() => {
    if (inputValues?.mark) setCaption(captions[inputValues.mark]);
    else setCaption(texts.rateCaptionText);
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
      }
    }
  }, [isOpen, data]);

  return (
    <form
      name="addStoryForm"
      onSubmit={handleSubmit(onFormSubmit)}
      className={classNames}
    >
      <Card sectionClass="profile-form__photo-upload">
        {(userImage?.imageUrl || userImage?.image) && (
          <img
            src={userImage.imageUrl || `${staticImageUrl}/${userImage.image}`}
            alt={data?.place}
            className="profile-form__uploaded-image"
          />
        )}

        <div
          className={`profile-form__input-upload ${
            userImage?.imageUrl || userImage?.image
              ? 'profile-form__input-upload_hidden'
              : ''
          }`}
        >
          <label htmlFor="input-upload" className="profile-form__label-file">
            <input
              id="input-upload"
              type="file"
              accept="image/png, image/jpeg"
              name="image"
              className="profile-form__input-file"
              onChange={(evt) => handleChangeImage(evt.target.files[0])}
            />
            <ButtonRound
              sectionClass={`profile-form__pseudo-button ${
                errors?.image ? 'profile-form__pseudo-button_error' : ''
              }`}
              color={`${errors?.image ? 'error' : 'lightGray'}`}
              isSpan
            />
          </label>
          <Caption
            title={texts.uploadCaptionText}
            sectionClass={`profile-form__caption ${
              errors?.image ? 'profile-form__caption_error' : ''
            }`}
          />
        </div>
      </Card>

      <Card sectionClass="profile-form__text-container">
        <div className="profile-form__texts">
          <div className="profile-form__input-wrap">
            <Input
              sectionClass="profile-form__input"
              type="text"
              name="place"
              placeholder={texts.placePlaceholder}
              register={register}
              required
              minLength={{ value: 5, message: 'Минимальная длина 5 символов' }}
              maxLength={{
                value: 128,
                message: 'Максимальная длина 128 символов',
              }}
              error={errors?.place}
              errorMessage={`${texts.placePlaceholder}*`}
            />
            {errors?.place && (
              <span className="profile-form__input-error">
                {errors?.place?.message}
              </span>
            )}
          </div>

          <Input
            type="text"
            name="date"
            placeholder={texts.datePlaceholder}
            onFocus={handleFocusDataInput}
            sectionClass={`profile-form__input profile-form__input_el_date ${
              errors.date ? 'profile-form__input_el_date-error' : ''
            }`}
            register={register}
            required
            error={errors?.date}
            errorMessage={texts.datePlaceholderError}
          />
          <div className="profile-form__input-wrap profile-form__input-wrap_textarea">
            <Input
              type="text"
              name="description"
              placeholder={texts.descrPlaceholder}
              sectionClass="profile-form__input profile-form__input_el_textarea"
              register={register}
              required
              maxLength={{
                value: 1024,
                message: 'Максимальная длина 1024 символа',
              }}
              error={errors?.description}
              errorMessage={`${texts.descrPlaceholder}*`}
              isTextarea
            />
            {errors?.description && (
              <span className="profile-form__input-error">
                {errors?.description?.message}
              </span>
            )}
          </div>

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
                title={`${
                  isEditMode ? texts.buttonCancelText : texts.buttonDeleteText
                }`}
                color="gray-borderless"
                sectionClass="profile-form__button_el_delete"
                onClick={handleCloseForm}
              />
              <Button
                title={`${
                  isEditMode ? texts.buttonSaveText : texts.buttonAddText
                }`}
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
