import './AccountForm.scss';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import Input from '../Input/Input';
import InputFileUpload from '../InputFileUpload/InputFileUpload';
import Caption from '../Caption/Caption';
import Rating from '../Rating/Rating';
import Button from '../Button/Button';

function AccountForm({ sectionClass, onCancel }) {
  const classNames = ['card-container', 'account-form', sectionClass].join(' ').trim();

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
            name="place"
            placeholder="Место встречи"
            required
          />
          <Input
            type="date"
            name="date"
            placeholder="Дата&emsp;"
            sectionClass="account-form__input_el_date"
            required
          />
          <Input
            type="text"
            name="story"
            placeholder="Опишите вашу встречу, какие чувства вы испытывали, что понравилось / не понравилось"
            sectionClass="account-form__input_el_textarea"
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
  sectionClass: PropTypes.string,
  onCancel: PropTypes.func
};

AccountForm.defaultProps = {
  sectionClass: '',
  onCancel: undefined
};

export default AccountForm;
