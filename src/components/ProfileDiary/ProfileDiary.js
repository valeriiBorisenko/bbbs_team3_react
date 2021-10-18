import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { formatDate, refineClassNames } from '../../utils/utils';
import captions from '../../utils/rating-captions';
import { staticImageUrl } from '../../config/config';
import defaultImage from '../../assets/icon-logo-no-text.svg';
import CardAnnotationContainer from '../Cards/CardAnnotation/CardAnnotationContainer';
import { Button, Caption, Card, Heading, Paragraph, Rating } from '../utils';
import './ProfileDiary.scss';

function ProfileDiary({
  data,
  onEdit,
  onDelete,
  onShare,
  sectionClass,
  selectedDiaryId,
  isWaitingResponse,
}) {
  const { image, place, description, mark, date, sentToCurator, hasCurator } =
    data;

  const eventDay = formatDate(date);
  const [caption, setCaption] = useState('');
  const isSendingToCurator = isWaitingResponse && selectedDiaryId === data?.id;

  useEffect(() => {
    setCaption(captions[mark]);
  }, [mark]);

  const handleEditButtonClick = () => {
    onEdit(data);
  };

  const handleDeleteButtonClick = () => {
    onDelete(data);
  };

  const handleShareButtonClick = () => {
    if (!sentToCurator) {
      onShare(data);
    }
  };

  const classNames = {
    main: refineClassNames(['card-container', 'profile-diary', sectionClass]),
    curatorButton: refineClassNames([
      'profile-diary__button',
      'profile-diary__button_curator',
      sentToCurator ? 'profile-diary__button_curator-shared' : '',
    ]),
  };

  return (
    <div className={classNames.main}>
      <Card sectionClass="profile-diary__image-container">
        <img
          className={
            image ? 'profile-diary__image' : 'profile-diary__image_default'
          }
          src={image ? `${staticImageUrl}/${image}` : defaultImage}
          alt={place}
          loading="lazy"
        />
      </Card>
      <Card sectionClass="profile-diary__date-container">
        <div className="profile-diary__text-wrap">
          <Heading
            level={2}
            type="small"
            sectionClass="profile-diary__card-title"
            content={place}
          />
          <div className="profile-diary__card-text">
            <CardAnnotationContainer>
              <Paragraph
                content={description}
                sectionClass="profile-diary__paragraph"
              />
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
            {hasCurator && (
              <Button
                title={
                  isSendingToCurator
                    ? texts.buttonTextSharing
                    : `${
                        sentToCurator
                          ? texts.buttonTextShared
                          : texts.buttonShareText
                      }`
                }
                color="gray-borderless"
                sectionClass={classNames.curatorButton}
                onClick={handleShareButtonClick}
                isDisabled={isSendingToCurator}
              />
            )}
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
  onShare: PropTypes.func,
  sectionClass: PropTypes.string,
  selectedDiaryId: PropTypes.number,
  isWaitingResponse: PropTypes.bool,
};

ProfileDiary.defaultProps = {
  data: {},
  onEdit: undefined,
  onDelete: undefined,
  onShare: undefined,
  sectionClass: '',
  selectedDiaryId: undefined,
  isWaitingResponse: false,
};

export default ProfileDiary;
