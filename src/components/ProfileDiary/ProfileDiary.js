import './ProfileDiary.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { formatDate } from '../../utils/utils';
import captions from '../../utils/rating-captions';
import { staticImageUrl } from '../../config/config';
import defaultImage from '../../assets/icon-logo-no-text.svg';
import CardAnnotationContainer from '../Cards/CardAnnotation/CardAnnotationContainer';
import { Card, TitleH2, Rating, Caption, Button } from '../utils/index';

function ProfileDiary({ data, onEdit, onDelete }) {
  const { image, place, description, mark, date } = data;

  const eventDay = formatDate(date);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    setCaption(captions[mark]);
  }, [mark]);

  const handleEditButtonClick = () => {
    onEdit(data);
  };

  const handleDeleteButtonClick = () => {
    onDelete(data);
  };

  return (
    <div className="card-container profile-diary">
      <Card sectionClass="profile-diary__image-container">
        <img
          className={
            image ? 'profile-diary__image' : 'profile-diary__image_default'
          }
          src={image ? `${staticImageUrl}/${image}` : defaultImage}
          alt={place}
        />
      </Card>
      <Card sectionClass="profile-diary__date-container">
        <div className="profile-diary__text-wrap">
          <TitleH2 sectionClass="profile-diary__card-title" title={place} />
          <div className="profile-diary__card-text">
            <CardAnnotationContainer>
              <p className="profile-diary__paragraph">{description}</p>
            </CardAnnotationContainer>
          </div>
        </div>
        <div className="profile-diary__card-date">
          <p className="profile-diary__weekday">{`${eventDay.monthName}, ${eventDay.year}`}</p>
          <p className="profile-diary__day">{eventDay.day}</p>
        </div>
        <div className="profile-diary__actions">
          <div className="profile-diary__rating">
            <Rating
              type="radio"
              ratingType={mark}
              value={mark}
              checked
              sectionClass="profile-diary__rate"
            />
            <Caption
              title={caption}
              sectionClass={`profile-diary__ratings-text profile-diary__ratings-text_type_${
                mark || 'neutral'
              }`}
            />
          </div>
          <div className="profile-diary__action-elements">
            <Button
              title={texts.buttonShareText}
              color="gray-borderless"
              sectionClass="profile-diary__button"
            />
            <Button
              title={texts.buttonEditText}
              color="gray-borderless"
              sectionClass="profile-diary__button"
              onClick={handleEditButtonClick}
            />
            <Button
              title={texts.buttonDeleteText}
              color="gray-borderless"
              sectionClass="profile-diary__button"
              onClick={handleDeleteButtonClick}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

ProfileDiary.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

ProfileDiary.defaultProps = {
  data: {},
  onEdit: () => {},
  onDelete: () => {},
};

export default ProfileDiary;
