import './AccountDiary.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/utils';
import Card from '../Card/Card';
import TitleH2 from '../TitleH2/TitleH2';
import CardAnnotationContainer from '../CardAnnotation/CardAnnotationContainer';
import Rating from '../Rating/Rating';
import Caption from '../Caption/Caption';
import Button from '../Button/Button';

function AccountDiary({
  data: {
    imageUrl, title, description, rate, date
  }
}) {
  const eventDay = formatDate(date);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (rate === 'good') setCaption('Было классно');
    if (rate === 'neutral') setCaption('Нормально');
    if (rate === 'bad') setCaption('Что-то пошло не так');
  }, []);

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
              sectionClass={`account-diary__ratings-text account-diary__ratings-text_type_${rate}`}
            />
          </div>
          <div className="account-diary__action-elements">
            <Button title="Поделиться с куратором" color="gray-borderless" sectionClass="account-diary__button" />
            <Button title="Редактировать" color="gray-borderless" sectionClass="account-diary__button" />
            <Button title="Удалить" color="gray-borderless" sectionClass="account-diary__button" />
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
  date: PropTypes.string
};

AccountDiary.defaultProps = {
  data: {},
  imageUrl: '',
  description: '',
  title: '',
  rate: 'neutral',
  date: ''
};

export default AccountDiary;
