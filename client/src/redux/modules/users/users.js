import axios from 'axios';
import jwt from 'jsonwebtoken';
import secret from '../../../config/secret';
import { ROOT_URL } from '../../../config/networkSettings';

import {
  SIGNING_UP_USER,
  SIGNUP_USER_FAIL,
  SIGNUP_USER_SUCCESS,
  VERIFYING_USER,
  ALREADY_VERIFIED,
  NOT_VERIFIED,
  VERIFY_USER_FAIL,
  VERIFY_USER_SUCCESS,
  LOGGING_IN_USER,
  LOGIN_USER_FAIL,
  LOGIN_USER_SUCCESS,
  LOGGING_OUT_USER,
  LOGOUT_USER_FAIL,
  LOGOUT_USER_SUCCESS,
  RETRIEVE_USER_LOADING,
  RETRIEVE_USER_FAIL,
  RETRIEVE_USER_SUCCESS,
  RETRIEVE_UPDATED_USER_LOADING,
  RETRIEVE_UPDATED_USER_FAIL,
  RETRIEVE_UPDATED_USER_SUCCESS,
  RETRIEVE_SOCKET_USER_LOADING,
  RETRIEVE_SOCKET_USER_FAIL,
  RETRIEVE_SOCKET_USER_SUCCESS,
  UPDATING_PROFILE,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
  GETTING_USERS,
  GETTING_USERS_SUCCESS,
  GETTING_USERS_FAIL,
  UPLOADING_PROFILE_IMAGE,
  UPLOAD_PROFILE_IMAGE_FAIL,
  UPLOAD_PROFILE_IMAGE_SUCCESS,
  SENDING_EMAIL,
  SEND_EMAIL_FAIL,
  SEND_EMAIL_SUCCESS,
  CHECKING_FORGOT_PASSWORD,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_SUCCESS,
  CHECKING_RESET_PASSWORD,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_VALUES,
  RESET_USER_VALUES
} from '../../types';

// Initial States
export const initialState = {
  isLoading: false,
  error: false,
  success: false,
  user: null
};

// Reducers
export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNING_UP_USER:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case SIGNUP_USER_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true
      };
    case SIGNUP_USER_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case VERIFYING_USER:
      return {
        ...state, isLoading: true, error: false, success: false, already: false
      };
    case ALREADY_VERIFIED:
      return {
        ...state, isLoading: false, error: false, success: false, already: true
      };
    case NOT_VERIFIED:
      return {
        ...state, isLoading: false, error: false, success: false, notVerified: true
      };
    case VERIFY_USER_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, already: false
      };
    case VERIFY_USER_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false, already: false
      };
    case LOGGING_IN_USER:
      return {
        ...state, isLoading: true, error: false, success: false, notVerified: false
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, user: action.payload, notVerified: false
      };
    case LOGIN_USER_FAIL:
      return {
        ...state, isLoading: false, error: true, logout: false, notVerified: false
      };
    case LOGGING_OUT_USER:
      return {
        ...state, isLoading: true, error: false, logout: false
      };
    case LOGOUT_USER_SUCCESS:
      return {
        ...state, isLoading: false, error: false, logout: true, user: null
      };
    case LOGOUT_USER_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case RETRIEVE_USER_LOADING:
      return {
        ...state, isLoading: true, retrieveUserError: false, retrieveUserSuccess: false,
      };
    case RETRIEVE_USER_SUCCESS:
      return {
        ...state, isLoading: false, retrieveUserError: false, retrieveUserSuccess: true, user: action.payload
      };
    case RETRIEVE_USER_FAIL:
      return {
        ...state, isLoading: false, retrieveUserError: true, retrieveUserSuccess: false,
      };
    case RETRIEVE_UPDATED_USER_LOADING:
      return {
        ...state, isLoading: true, retrieveUpdatedUserError: false, retrieveUpdatedUserSuccess: false,
      };
    case RETRIEVE_UPDATED_USER_SUCCESS:
      return {
        ...state, isLoading: false, retrieveUpdatedUserError: false, retrieveUpdatedUserSuccess: true, user: action.payload
      };
    case RETRIEVE_UPDATED_USER_FAIL:
      return {
        ...state, isLoading: false, retrieveUpdatedUserError: true, retrieveUpdatedUserSuccess: false,
      };
    case RETRIEVE_SOCKET_USER_LOADING:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case RETRIEVE_SOCKET_USER_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, user: action.payload
      };
    case RETRIEVE_SOCKET_USER_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case UPDATING_PROFILE:
      return { ...state, isLoading: true, error: false, success: false };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, user: action.payload
      };
    case UPDATE_PROFILE_FAIL:
      return { ...state, isLoading: false, error: true, success: false };
    case GETTING_USERS:
      return { ...state, isLoading: true, error: false, success: false };
    case GETTING_USERS_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, users: action.payload
      };
    case GETTING_USERS_FAIL:
      return { ...state, isLoading: false, error: true, success: false };
    case UPLOADING_PROFILE_IMAGE:
      return { ...state, isLoading: true, error: false, success: false };
    case UPLOAD_PROFILE_IMAGE_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, user: action.payload
      };
    case UPLOAD_PROFILE_IMAGE_FAIL:
      return { ...state, isLoading: false, error: true, success: false };
    case SENDING_EMAIL:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case SEND_EMAIL_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, resultEmail: true
      };
    case SEND_EMAIL_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false, noEmail: true
      };
    case CHECKING_FORGOT_PASSWORD:
      return {
        ...state, isLoading: true, forgotPassError: false, forgotPassSuccess: false
      };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state, isLoading: false, forgotPassError: false, forgotPassSuccess: true
      };
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state, isLoading: false, forgotPassError: true, forgotPassSuccess: false
      };
    case CHECKING_RESET_PASSWORD:
      return {
        ...state, isLoading: true, resetPassError: false, resetPassSuccess: false
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state, isLoading: false, resetPassError: false, resetPassSuccess: true
      };
    case RESET_PASSWORD_FAIL:
      return {
        ...state, isLoading: false, resetPassError: true, resetPassSuccess: false
      };
    case RESET_VALUES:
      return {
        ...state, isLoading: false, error: false, success: false, logout: false, retrieveUserError: false, retrieveUserSuccess: false, retrieveUpdatedUserError: false, retrieveUpdatedUserSuccess: false
      };
    case RESET_USER_VALUES:
      return {
        ...state, isLoading: false, error: false, success: false, logout: false, user: null, notVerified: false, already: false, resultEmail: false, noEmail: false, forgotPassError: false, forgotPassSuccess: false, resetPassError: false, resetPassSuccess: false
      };
    default:
      return state;
  }
};

// Actions
export const userSignup = params => async dispatch => {
  dispatch({ type: SIGNING_UP_USER });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/userSignup`, params);
    if(response.data) {
      dispatch({ type: SIGNUP_USER_SUCCESS });
    } else {
      dispatch({ type: SIGNUP_USER_FAIL });
    }
  } catch(err) {
    dispatch({ type: SIGNUP_USER_FAIL });
  }
};

export const userVerification = params => async dispatch => {
  dispatch({ type: VERIFYING_USER });
  try {
    const response = await axios.put(`${ROOT_URL}/api/v1/userVerification`, params);
    if(response.data.success === "Account has already been verified") {
      dispatch({ type: ALREADY_VERIFIED });
    } else if (response.data.success === "Success verifying account") {
      dispatch({ type: VERIFY_USER_SUCCESS });
    } else {
      dispatch({ type: VERIFY_USER_FAIL });
    }
  } catch(err) {
    dispatch({ type: VERIFY_USER_FAIL });
  }
};

export const userLogin = params => async dispatch => {
  dispatch({ type: LOGGING_IN_USER });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/userLogin`, params);
    if (response.data) {
      jwt.verify(response.data, secret, function(err, decoded) {
        if (!err) {
          localStorage.setItem('user', JSON.stringify(decoded.loginUser));
          dispatch({ type: LOGIN_USER_SUCCESS, payload: decoded.loginUser });
        } else {
          dispatch({ type: LOGIN_USER_FAIL });
        }
      });
    } else {
      dispatch({ type: LOGIN_USER_FAIL });
    }
  } catch (err) {
    if (err.response.data.error === "Account not verified") {
      dispatch({ type: NOT_VERIFIED });
    } else {
      dispatch({ type: LOGIN_USER_FAIL });
    }
  }
};

export const userLogout = params => async dispatch => {
  dispatch({ type: LOGGING_OUT_USER });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/userLogout`, params);
    if (response.data) {
      localStorage.removeItem('user');
      dispatch({ type: LOGOUT_USER_SUCCESS });
    } else {
      dispatch({ type: LOGOUT_USER_FAIL });
    }
  } catch (err) {
    if (err) {
      dispatch({ type: LOGOUT_USER_FAIL });
    }
  }
};

export const getUpdatedUser = params => async dispatch => {
  dispatch({ type: RETRIEVE_UPDATED_USER_LOADING });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/getSingleUser`, params);
    if(response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      dispatch({ type: RETRIEVE_UPDATED_USER_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: RETRIEVE_UPDATED_USER_FAIL });
    }
  } catch(err) {
    dispatch({ type: RETRIEVE_UPDATED_USER_FAIL });
  }
};

export const currentUser = () => async dispatch => {
  dispatch({ type: RETRIEVE_USER_LOADING });
  try {
    let user = await JSON.parse(localStorage.getItem('user'));
    if(user) {
      dispatch({ type: RETRIEVE_USER_SUCCESS, payload: user });
    } else {
      dispatch({ type: RETRIEVE_USER_FAIL });
    }
  } catch(err) {
    dispatch({ type: RETRIEVE_USER_FAIL });
  }
};

export const currentSocketUser = () => async dispatch => {
  dispatch({ type: RETRIEVE_SOCKET_USER_LOADING });
  try {
    let user = await JSON.parse(localStorage.getItem('user'));
    if(user) {
      dispatch({ type: RETRIEVE_SOCKET_USER_SUCCESS, payload: user });
    } else {
      dispatch({ type: RETRIEVE_SOCKET_USER_FAIL });
    }
  } catch(err) {
    dispatch({ type: RETRIEVE_SOCKET_USER_FAIL });
  }
};

export const userUpdate = params => async (dispatch) => {
  dispatch({ type: RETRIEVE_USER_LOADING });
  try {
    const response = await axios({
      method: 'put',
      url: `${ROOT_URL}/api/v1/userUpdate`,
      data: params,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      dispatch({ type: RETRIEVE_USER_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: RETRIEVE_USER_FAIL });
    }
  } catch (err) {
    dispatch({ type: RETRIEVE_USER_FAIL });
  }
};

export const getUsers = params => async dispatch => {
  dispatch({ type: GETTING_USERS });
  try {
    const response = await axios.get(`${ROOT_URL}/api/v1/getUsers`, params);
    if (response.data) {
      dispatch({ type: GETTING_USERS_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: GETTING_USERS_FAIL });
    }
  } catch(err) {
    dispatch({ type: GETTING_USERS_FAIL });
  }
}

export const uploadProfileImage = params => async dispatch => {
  dispatch({ type: UPLOADING_PROFILE_IMAGE });
  try {
    const response = await axios({
      method: 'put',
      url: `${ROOT_URL}/api/v1/uploadProfileImage`,
      data: params,
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      dispatch({ type: UPLOAD_PROFILE_IMAGE_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: UPLOAD_PROFILE_IMAGE_FAIL });
    }
  } catch (err) {
    dispatch({ type: UPLOAD_PROFILE_IMAGE_FAIL });
  }
};

export const sendEmail = params => async dispatch => {
  dispatch({ type: SENDING_EMAIL });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/sendEmail`, params);
    if (response.data) {
      dispatch({ type: SEND_EMAIL_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: SEND_EMAIL_FAIL });
    }
  } catch(err) {
    dispatch({ type: SEND_EMAIL_FAIL });
  }
}

export const forgotPassword = params => async dispatch => {
  try {
    dispatch({ type: CHECKING_FORGOT_PASSWORD });
    const response = await axios.post(`${ROOT_URL}/api/v1/forgotPassword`, params);
    if (response.data) {
      dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: 'forgot-password-fail' });
    } else {
      dispatch({ type: FORGOT_PASSWORD_FAIL, payload: 'forgot-password-fail' });
    }
  } catch (err) {
    dispatch({ type: FORGOT_PASSWORD_FAIL, payload: 'forgot-password-fail' });
  }
};

export const resetPassword = params => async dispatch => {
  try {
    dispatch({ type: CHECKING_RESET_PASSWORD });
    const response = await axios.post(`${ROOT_URL}/api/v1/resetPassword`, params);
    if (response.data) {
      dispatch({ type: RESET_PASSWORD_SUCCESS, payload: 'forgot-password-fail' });
    } else {
      dispatch({ type: RESET_PASSWORD_FAIL, payload: 'forgot-password-fail' });
    }
  } catch (err) {
    dispatch({ type: RESET_PASSWORD_FAIL, payload: 'forgot-password-fail' });
  }
};

export function resetValues() {
  return function(dispatch) {
    dispatch({ type: RESET_VALUES });
  };
}

export function resetUserValues() {
  return function(dispatch) {
    dispatch({ type: RESET_USER_VALUES });
  };
}
