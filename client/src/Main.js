import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute.js';
import Home from './views/Home/Home';
import Loading from './components/Loading/Loading';

const Dashboard = lazy(() => import("./views/Dashboard/Dashboard"));
const Verification = lazy(() => import("./views/Verification/Verification"));
const ResetPassword = lazy(() => import("./views/ResetPassword/ResetPassword"));

const Main = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <PrivateRoute path="/Dashboard" component={Dashboard} />
      <Route path="/Verification" component={Verification} />
      <Route path="/ResetPassword" component={ResetPassword} />
      <Route path="/" component={Home} />
    </Switch>
  </Suspense>
);

export default Main;