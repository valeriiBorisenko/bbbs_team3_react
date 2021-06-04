/* eslint-disable react/jsx-props-no-spreading */
//! не дает использовать spread на пропсах, в дальнейшем заменить!
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function ProtectedRoute({ component: Component, ...props }) {
  const currentUser = useContext(CurrentUserContext);
  console.log(currentUser);

  return (
    <Route>
      {() => (props.isAuth ? <Component {...props} /> : <Redirect to="/" />) }
    </Route>
  );
}

ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  isAuth: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

export default ProtectedRoute;
