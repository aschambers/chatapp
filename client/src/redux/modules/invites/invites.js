import axios from 'axios';
import { ROOT_URL } from '../../../config/networkSettings';

import {
  CREATING_INVITE,
  CREATE_INVITE_FAIL,
  CREATE_INVITE_SUCCESS,
  CREATING_EMAIL_INVITE,
  CREATE_INVITE_EMAIL_FAIL,
  CREATE_INVITE_EMAIL_SUCCESS,
  VERIFYING_SERVER_INVITE,
  VERIFY_SERVER_INVITE_FAIL,
  VERIFY_SERVER_INVITE_SUCCESS
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
    case CREATING_INVITE:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case CREATE_INVITE_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, inviteLink: action.payload
      };
    case CREATE_INVITE_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case CREATING_EMAIL_INVITE:
      return {
        ...state, isLoading: true, inviteEmailError: false, inviteEmailSuccess: false
      };
    case CREATE_INVITE_EMAIL_SUCCESS:
      return {
        ...state, isLoading: false, inviteEmailError: false, inviteEmailSuccess: true, inviteLink: ""
      };
    case CREATE_INVITE_EMAIL_FAIL:
      return {
        ...state, isLoading: false, inviteEmailError: true, inviteEmailSuccess: false, inviteLink: ""
      };
    case VERIFYING_SERVER_INVITE:
      return {
        ...state, isLoading: true, verifyError: false, verifySuccess: false
      };
    case VERIFY_SERVER_INVITE_SUCCESS:
      return {
        ...state, isLoading: false, verifyError: false, verifySuccess: true, userList: action.payload
      };
    case VERIFY_SERVER_INVITE_FAIL:
      return {
        ...state, isLoading: false, verifyError: false, verifySuccess: true
      };
    default:
      return state;
  }
};

// Actions
export const inviteCreate = params => async dispatch => {
  dispatch({ type: CREATING_INVITE });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/inviteCreate`, params);
    if(response.data) {
      console.log(response);
      console.log(response.data);
      dispatch({ type: CREATE_INVITE_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: CREATE_INVITE_FAIL });
    }
  } catch(err) {
    dispatch({ type: CREATE_INVITE_FAIL });
  }
};

export const inviteEmailCreate = params => async dispatch => {
  dispatch({ type: CREATING_EMAIL_INVITE });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/inviteEmailCreate`, params);
    if(response.data) {
      dispatch({ type: CREATE_INVITE_EMAIL_SUCCESS });
    } else {
      dispatch({ type: CREATE_INVITE_EMAIL_FAIL });
    }
  } catch(err) {
    dispatch({ type: CREATE_INVITE_EMAIL_FAIL });
  }
};

export const serverFind = params => async dispatch => {
  dispatch({ type: VERIFYING_SERVER_INVITE });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/serverFind`, params);
    if(response.data) {
      dispatch({ type: VERIFY_SERVER_INVITE_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: VERIFY_SERVER_INVITE_FAIL });
    }
  } catch(err) {
    dispatch({ type: VERIFY_SERVER_INVITE_FAIL });
  }
};
