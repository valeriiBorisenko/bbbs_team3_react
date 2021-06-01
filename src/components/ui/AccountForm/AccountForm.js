/* eslint-disable max-len */
import './AccountForm.scss';
import Card from '../Card/Card';
import Input from '../Input/Input';
import InputFileUpload from '../InputFileUpload/InputFileUpload';
import Caption from '../Caption/Caption';
import Rating from '../Rating/Rating';
import Button from '../Button/Button';

function AccountForm() {
  return (
    <article className="card-container account-form">
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
            isRequred
          />
          <Input
            type="date"
            name="date"
            placeholder="Дата&emsp;"
            sectionClass="account-form__input_el_date"
            isRequred
          />
          <Input
            type="text"
            name="story"
            placeholder="Опишите вашу встречу, какие чувства вы испытывали, что понравилось / не понравилось"
            sectionClass="account-form__input_el_textarea"
            isRequred
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
              <Button title="Удалить" color="gray-borderless" />
              <Button title="Добавить" isSubmittable isDisabled sectionClass="account-form__button_el_add" />
            </div>
          </div>
        </form>
      </Card>
    </article>
  );
}

export default AccountForm;