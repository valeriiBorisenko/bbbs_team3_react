import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import Popup from '../Popup/Popup';
import { Button, Heading } from '../../utils';
import { ErrorsContext } from '../../../contexts';
import './PopupError.scss';

function PopupError({ isOpen, onClose }) {
  const { serverError } = useContext(ErrorsContext);

  const closeOnEsc = (evt) => {
    if (evt.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', closeOnEsc);
    return () => window.removeEventListener('keyup', closeOnEsc);
  }, []);

  return (
    <Popup
      type="error"
      typeContainer="calendar"
      sectionClass="popup__container_error"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Heading
        level={2}
        type="small"
        sectionClass="popup__title_type_calendar popup__title_type_error"
        content={serverError?.title}
      />
      <div className="popup__buttons_type_calendar">
        <Button
          color="black"
          title={serverError?.button}
          sectionClass="popup__button_type_error"
          onClick={onClose}
        />
      </div>
    </Popup>
  );
}

PopupError.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupError.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupError;
