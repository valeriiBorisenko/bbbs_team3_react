import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { CurrentUserContext } from '../../contexts';

function ProtectedRoute({ component: Component, ...props }) {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <Route>
      {() => (currentUser ? <Component {...props} /> : <Redirect to="/" />)}
    </Route>
  );
}

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default ProtectedRoute;
