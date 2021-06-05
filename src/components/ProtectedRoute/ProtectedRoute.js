/* eslint-disable react/jsx-props-no-spreading */
//! не дает использовать spread на пропсах, в дальнейшем заменить!
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...props }) {
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
