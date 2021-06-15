import './AccountDiary.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  formatDate, Card, TitleH2, CardAnnotationContainer, Rating, Caption, Button
} from './index';

function AccountDiary({ data, onEdit, onDelete }) {
  const {
    imageUrl, title, description, rate, date
  } = data;

  const eventDay = formatDate(date);
  const [caption, setCaption] = useState('Нормально');

  useEffect(() => {
    if (rate === 'good') setCaption('Было классно');
    if (rate === 'neutral') setCaption('Нормально');
    if (rate === 'bad') setCaption('Что-то пошло не так');
  }, [data.rate]);

  const handleEditButtonClick = () => {
    onEdit(data);
  };

  const handleDeleteButtonClick = () => {
    onDelete(data);
  };

  return (
    <div className="card-container account-diary">
      <Card sectionClass="account-diary__image-container">
        <img className="account-diary__image" src={imageUrl} alt={title} />
      </Card>
      <Card sectionClass="account-diary__date-container">
        <div className="account-diary__text-wrap">
          <TitleH2 sectionClass="account-diary__card-title" title={title} />
          <div className="account-diary__card-text">
            <CardAnnotationContainer>
              <p className="account-diary__paragraph">{description}</p>
            </CardAnnotationContainer>
          </div>
        </div>
        <div className="account-diary__card-date">
          <p className="account-diary__weekday">{`${eventDay.monthName}, ${eventDay.year}`}</p>
          <p className="account-diary__day">{eventDay.day}</p>
        </div>
        <div className="account-diary__actions">
          <div className="account-diary__rating">
            <Rating type="radio" ratingType={rate} value={rate} checked sectionClass="account-diary__rate" />
            <Caption
              title={caption}
              sectionClass={`account-diary__ratings-text account-diary__ratings-text_type_${rate || 'neutral'}`}
            />
          </div>
          <div className="account-diary__action-elements">
            <Button
              title="Поделиться с куратором"
              color="gray-borderless"
              sectionClass="account-diary__button"
            />
            <Button
              title="Редактировать"
              color="gray-borderless"
              sectionClass="account-diary__button"
              onClick={handleEditButtonClick}
            />
            <Button
              title="Удалить"
              color="gray-borderless"
              sectionClass="account-diary__button"
              onClick={handleDeleteButtonClick}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

AccountDiary.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  imageUrl: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  rate: PropTypes.string,
  date: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

AccountDiary.defaultProps = {
  data: {},
  imageUrl: '',
  description: '',
  title: '',
  rate: 'neutral',
  date: '',
  onEdit: () => {},
  onDelete: () => {}
};

export default AccountDiary;
