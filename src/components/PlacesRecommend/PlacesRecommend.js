import { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { ErrorsContext } from '../../contexts';
import { ERROR_CODES, ERROR_MESSAGES } from '../../config/constants';
import { refineClassNames } from '../../utils/utils';
import FormRecommendation from '../FormRecommendation/FormRecommendation';
import { CloseButton, Paragraph } from '../utils';
import { postPlace } from '../../api/places-page';
import './PlacesRecommend.scss';

function PlacesRecommend({ sectionClass, activityTypes, openSuccessPopup }) {
  const { setError } = useContext(ErrorsContext);
  const { generalErrorMessage } = ERROR_MESSAGES;
  const { unauthorized, badRequest } = ERROR_CODES;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const scrollAnchorRef = useRef(null);
  const scrollToForm = () => {
    scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openForm = () => {
    setIsFormOpen(true);
    scrollToForm();
  };

  const createFormData = (data) => {
    const formData = new FormData();
    if (data.link) formData.append('link', data.link);
    formData.append('image', data.image);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('address', data.address);
    formData.append('gender', data.gender);
    formData.append('age', data.age);
    formData.append('city', data.city);
    formData.append('activityType', data.activityType);
    return formData;
  };

  const handleFormSubmit = (data) => {
    setIsWaitingResponse(true);
    postPlace(createFormData(data))
      .then(() => {
        openSuccessPopup();
        closeForm();
      })
      .catch((err) => {
        if (err?.status === badRequest || err?.status === unauthorized) {
          setError(err?.data);
        } else
          setError({
            message: generalErrorMessage.title,
          });
      })
      .finally(() => setIsWaitingResponse(false));
  };

  const renderText = () => (
    <>
      {texts.recommendadionTextPart1}
      <button
        className="recommendation__text-link"
        type="button"
        onClick={openForm}
      >
        {texts.recommendadionButton}
      </button>
      {texts.recommendadionTextPart2}
    </>
  );

  const classNames = {
    main: refineClassNames([
      'recommendation',
      'recommendation_place_page',
      'fade-in',
      sectionClass,
    ]),
  };

  return (
    <>
      <section className={classNames.main} ref={scrollAnchorRef}>
        <div className="recommendation__container">
          {isFormOpen && (
            <CloseButton
              sectionClass="recommendation__close-button"
              onClick={closeForm}
            />
          )}
          <Paragraph
            content={renderText()}
            size="big"
            sectionClass="recommendation__text"
          />
          <FormRecommendation
            isOpen={isFormOpen}
            onSubmit={handleFormSubmit}
            activityTypes={activityTypes}
            isWaitingResponse={isWaitingResponse}
          />
        </div>
      </section>
    </>
  );
}

PlacesRecommend.propTypes = {
  activityTypes: PropTypes.arrayOf(PropTypes.object),
  sectionClass: PropTypes.string,
  openSuccessPopup: PropTypes.func,
};

PlacesRecommend.defaultProps = {
  activityTypes: [],
  sectionClass: '',
  openSuccessPopup: () => {},
};

export default PlacesRecommend;
