import './AccountDiary.scss';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import TitleH2 from '../TitleH2/TitleH2';
import CardAnnotationContainer from '../CardAnnotation/CardAnnotationContainer';

// TODO форматировать дату из входных данных

function AccountDiary({ data: { imageUrl, title, description } }) {
  return (
    <div className="card-container account-diary">
      <Card sectionClass="account-diary__image-container">
        <img className="account-diary__image" src={imageUrl} alt={title} />
      </Card>
      <Card sectionClass="account-diary__date-container">
        <div className="account-diary__text-wrap">
          <TitleH2 sectionClass="account-diary__card-title" title={title} />
          <CardAnnotationContainer>
            <p className="account-diary__paragraph">
              {description}
            </p>
          </CardAnnotationContainer>
        </div>
        <div className="account-diary__card-date">
          <p className="account-diary__weekday">декабрь, 2020</p>
          <p className="account-diary__day">05</p>
        </div>
        <div className="personal-area__actions" />
      </Card>
    </div>
  );
}

AccountDiary.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  imageUrl: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string
};

AccountDiary.defaultProps = {
  data: {},
  imageUrl: '',
  description: '',
  title: ''
};

export default AccountDiary;
