import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute.js';
import Home from './views/Home/Home';
import Loading from './components/Loading/Loading';
import { BrowserRouter } from 'react-router-dom';

const Main = () => (
  <Suspense fallback={<Loading />}>
    <BrowserRouter>
      <Routes>
        <Route path='/Dashboard' element={<PrivateRoute/>}>
          <Route path='/Dashboard' lazy={() => import("./views/Dashboard/Dashboard")}/>
        </Route>
        <Route path="/Verification" element={() => import("./views/Verification/Verification")} />
        <Route path="/ResetPassword" element={() => import("./views/ResetPassword/ResetPassword")} />
        <Route path="/Login" element={<Home />} />
        <Route path="/Signup" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </Suspense>
);

export default Main;