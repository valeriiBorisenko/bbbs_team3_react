/* eslint-disable react/jsx-props-no-spreading */
//! не дает использовать spread на пропсах, в дальнейшем заменить!
import { useContext } from 'react';
// import CurrentUserContext from '../../contexts/CurrentUserContext';
// eslint-disable-next-line react/jsx-props-no-spreading
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function ProtectedRoute({ component: Component, ...props }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <Route>
      {() => (currentUser ? <Component {...props} /> : <Redirect to={props.path} />) }
    </Route>
  );
}

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired
};

export default ProtectedRoute;
