import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { CurrentUserContext } from '../../contexts';
import { MAIN_PAGE_URL } from '../../config/routes';

function ProtectedRoute({ component: Component, ...props }) {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <Route>
      {() =>
        currentUser ? <Component {...props} /> : <Redirect to={MAIN_PAGE_URL} />
      }
    </Route>
  );
}

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default ProtectedRoute;
