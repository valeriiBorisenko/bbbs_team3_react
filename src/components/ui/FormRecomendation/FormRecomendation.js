/* eslint-disable react/jsx-props-no-spreading */
import './FormRecomendation.scss';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Input from '../Input/Input';
import Button from '../Button/Button';

function FormRecomendation({ isOpen }) {
  const textAreaPlaceholder = window.innerWidth < 576
    ? 'Комментарий*'
    : 'Комментарий* Поделитесь впечатлениями о проведенном времени';

  const formClassNames = ['form-recom', isOpen ? 'form-recom_opened' : ''].join(' ').trim();

  const {
    register, handleSubmit, formState: { errors }, reset
  } = useForm();

  const onFormSubmit = (values) => {
    let inputFields = Object.assign(values);
    inputFields = {
      ...inputFields,
      image: URL.createObjectURL(inputFields.image[0])
    };
    console.log({ inputFields });
  };

  useEffect(() => {
    reset({
      title: '',
      link: '',
      address: '',
      age: '',
      description: '',
      imageUrl: ''
    });
  }, [isOpen]);

  return (
    <form
      className={formClassNames}
      name="formRecomendation"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="form-recom__input-container">
        <Input
          sectionClass="form-recom__input"
          type="text"
          name="title"
          placeholder="Название*"
          register={register}
          required
          error={errors?.title}
          errorMessage="Название*"
        />
        <Input
          sectionClass="form-recom__input"
          type="text"
          name="link"
          placeholder="Сайт"
          register={register}
        />
      </div>

      <Input
        sectionClass="form-recom__input"
        type="text"
        name="address"
        placeholder="Адрес*"
        register={register}
        required
        error={errors?.address}
        errorMessage="Адрес*"
      />

      <div className="form-recom__input-container">
        <div className="form-recom__radio-inputs">
          <label className="form-recom__label" htmlFor="formRecommendationBoy">
            <input
              id="formRecommendationBoy"
              className="form-recom__input-radio"
              type="radio"
              name="sex"
              {...register('sex', { required: 'Мальчик' })}
              value="Мальчик"
            />
            <span className={`form-recom__pseudo-radio ${errors?.sex ? 'form-recom__pseudo-radio_error' : ''}`}>Мальчик</span>
          </label>
          <label className="form-recom__label" htmlFor="formRecommendationGirl">
            <input
              id="formRecommendationGirl"
              className="form-recom__input-radio"
              type="radio"
              name="sex"
              {...register('sex', { required: 'Девочка' })}
              value="Девочка"
            />
            <span className={`form-recom__pseudo-radio ${errors?.sex ? 'form-recom__pseudo-radio_error' : ''}`}>Девочка</span>
          </label>
        </div>
        <Input
          sectionClass="form-recom__input"
          type="number"
          name="age"
          placeholder="Возраст*"
          register={register}
          required
          error={errors?.age}
          errorMessage="Возраст*"
        />
      </div>

      <select
        className={`form-recom__select ${errors?.type ? 'form-recom__select_error' : ''}`}
        name="type"
        {...register('type', { required: 'Тип отдыха*' })}
      >
        <option className="form-recom__option" defaultValue="Тип отдыха" hidden>Тип отдыха*</option>
        <option value="Активный" className="form-recom__option">Активный</option>
        <option value="Развлекательный" className="form-recom__option">Развлекательный</option>
        <option value="Познавательный" className="form-recom__option">Познавательный</option>
      </select>

      <Input
        sectionClass="form-recom__input form-recom__input_textarea"
        type="text"
        name="description"
        placeholder={textAreaPlaceholder}
        register={register}
        required
        error={errors?.description}
        errorMessage={textAreaPlaceholder}
        isTextarea
      />
      <div className="form-recom__submit-zone">
        <label htmlFor="formRecomInputUpload">
          <input
            id="formRecomInputUpload"
            type="file"
            name="imageUrl"
            className="form-recom__input-radio"
            {...register('image', {
              required: 'Добавить фото'
            })}
          />
          <button className="button" type="button" disabled>Добавить</button>
        </label>

        <Button
          title="Отправить"
          color="blue"
          isSubmittable
        />
      </div>
    </form>
  );
}

FormRecomendation.propTypes = {
  isOpen: PropTypes.bool
};

FormRecomendation.defaultProps = {
  isOpen: false
};

export default FormRecomendation;
