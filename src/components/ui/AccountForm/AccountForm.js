import './AccountForm.scss';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  useEffect(() => {
    setInputValues(data);
  }, [isOpen]);

  return (
    <div className={classNames}>
      <Card sectionClass="account-form__photo-upload">
        <InputFileUpload sectionClass="account-form__input_el_file" />
        <Caption title="Загрузить фото" sectionClass="account-form__caption" />
      </Card>
      <Card sectionClass="account-form__form-container">
        <form name="addStoryForm" className="account-form__form">
          <Input
            type="text"
            name="title"
            placeholder="Место встречи"
            onChange={handleInputChange}
            value={inputValues.title || ''}
            required
          />
          <Input
            type="date"
            name="date"
            placeholder="Дата&emsp;"
            sectionClass="account-form__input_el_date"
            onChange={handleInputChange}
            value={parseDate(inputValues.date) || ''}
            required
          />
          <Input
            type="text"
            name="description"
            placeholder="Опишите вашу встречу, какие чувства вы испытывали, что понравилось / не понравилось"
            sectionClass="account-form__input_el_textarea"
            onChange={handleInputChange}
            value={inputValues.description || ''}
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
              <Button title="Добавить" isSubmittable sectionClass="account-form__button_el_add" />
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
