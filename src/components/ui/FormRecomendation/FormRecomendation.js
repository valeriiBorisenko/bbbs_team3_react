import Input from '../Input/Input';

function FormRecomendation() {
  return (
    <form noValidate>
      <Input
        sectionClass="popup__input"
        type="text"
        name="place"
        placeholder="Название*"
        // register={register}
        required
        // error={errors?.login}
        errorMessage="Название*"
      />
      <Input
        sectionClass="popup__input"
        type="text"
        name="website"
        placeholder="Сайт"
        // register={register}
        // required
        // error={errors?.login}
        errorMessage="Сайт"
      />
      <Input
        sectionClass="popup__input"
        type="text"
        name="adress"
        placeholder="Адрес*"
        // register={register}
        required
        // error={errors?.login}
        errorMessage="Адрес*"
      />

      {/* девочка / мальчик / пол */}
    </form>
  );
}

export default FormRecomendation;
