import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Cart from "pages/Cart/Cart";
import ForgetPassword from "pages/forgetpassword/ForgetPassword";
import Login from "pages/login/Login";
import LandingPage from "pages/LandingPage/LandingPage";
import Profile from "pages/profile/Profile";
import Register from "pages/register/Register";
import ProductDetail from "pages/ProductDetail/ProductDetail";
import ProductSearch from "pages/ProductSearch/ProductSearch";
import NotFound404 from "pages/NotFound404/NotFound404";
import PrivateRoute from "components/atoms/PrivateRoute/PrivateRoute";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/search" component={ProductSearch} />
        <Route path="/product/:productId" component={ProductDetail} />
        <PrivateRoute path="/cart" component={Cart} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgetPasword" component={ForgetPassword} />
        <Route path="/profile" component={Profile} />
        <Route path="*" component={NotFound404} />
      </Switch>
    </Router>
  );
};

export default Routes;
