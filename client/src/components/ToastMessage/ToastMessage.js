import React from 'react';
import { ToastContainer } from 'react-toastify';
import './ToastMessage.css';

import 'react-toastify/dist/ReactToastify.css';

const ToastMessage = () => {
  return (
    <div>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default ToastMessage;