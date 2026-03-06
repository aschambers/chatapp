import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute.js';
import Home from './views/Home/Home';
import Loading from './components/Loading/Loading';
import { BrowserRouter } from 'react-router-dom';

const Dashboard = lazy(() => import("./views/Dashboard/Dashboard"));
const Verification = lazy(() => import("./views/Verification/Verification"));
const ResetPassword = lazy(() => import("./views/ResetPassword/ResetPassword"));

const Main = () => (
  <Suspense fallback={<Loading />}>
    <BrowserRouter>
      <Routes>
        <Route path='/dashboard' element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Route>
        <Route path="/verification" element={<Verification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Home />} />
        <Route path="/signup" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </Suspense>
);

export default Main;