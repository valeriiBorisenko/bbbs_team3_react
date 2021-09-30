import './IconEye.scss';
import PropTypes from 'prop-types';

function IconEye({ isClosed, sectionClass }) {
  const classNames = ['icon-eye', sectionClass].join(' ').trim();

  if (isClosed) {
    return (
      <svg
        className={classNames}
        viewBox="0 0 105 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M54.2855 25C23.1208 25 6 5 0.519531 0.530273C7.26436 12.4919 27.4244 34.6788 54.2855 34.6788C79 34.6788 98.9941 11.3343 104.583 0.530273C98 6 82.2225 25 54.2855 25Z"
          fill="white"
        />
        <line
          x1="15.0607"
          y1="17.0607"
          x2="9.06066"
          y2="23.0607"
          stroke="white"
          strokeWidth="3"
        />
        <line
          x1="38.1287"
          y1="31.4784"
          x2="35.4224"
          y2="39.5205"
          stroke="white"
          strokeWidth="3"
        />
        <line
          x1="69.3376"
          y1="31.3212"
          x2="73.1777"
          y2="38.8878"
          stroke="white"
          strokeWidth="3"
        />
        <line
          x1="92.0513"
          y1="15.9301"
          x2="98.1036"
          y2="21.8773"
          stroke="white"
          strokeWidth="3"
        />
      </svg>
    );
  }

  return (
    <svg
      className={classNames}
      viewBox="0 0 105 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.519531 34.5301C6.68624 22.5684 26.0728 -1.00756 54.2855 0.381535C82.4982 1.77063 99.5722 23.726 104.583 34.5301C98.9941 45.3341 81.1106 67.2895 54.2855 68.6786C27.4603 70.0677 7.26436 46.4917 0.519531 34.5301ZM52.5548 58.8389C65.9651 58.8389 76.8362 47.9554 76.8362 34.5298C76.8362 21.1043 65.9651 10.2207 52.5548 10.2207C39.1446 10.2207 28.2734 21.1043 28.2734 34.5298C28.2734 47.9554 39.1446 58.8389 52.5548 58.8389Z"
        fill="#fff"
      />
    </svg>
  );
}

IconEye.propTypes = {
  isClosed: PropTypes.bool,
  sectionClass: PropTypes.string,
};

IconEye.defaultProps = {
  isClosed: false,
  sectionClass: '',
};

export default IconEye;
