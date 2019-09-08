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
  VERIFY_SERVER_INVITE_SUCCESS,
  FINDING_INVITES,
  FIND_INVITE_FAIL,
  FIND_INVITE_SUCCESS,
  RESET_INVITE_VALUES
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
        ...state, isLoading: false, error: false, success: true, inviteCode: action.payload
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
        ...state, isLoading: false, inviteEmailError: false, inviteEmailSuccess: true, inviteCode: ""
      };
    case CREATE_INVITE_EMAIL_FAIL:
      return {
        ...state, isLoading: false, inviteEmailError: true, inviteEmailSuccess: false, inviteCode: ""
      };
    case VERIFYING_SERVER_INVITE:
      return {
        ...state, isLoading: true, verifyError: false, verifySuccess: false
      };
    case VERIFY_SERVER_INVITE_SUCCESS:
      return {
        ...state, isLoading: false, verifyError: false, verifySuccess: true, inviteServersList: action.payload
      };
    case VERIFY_SERVER_INVITE_FAIL:
      return {
        ...state, isLoading: false, verifyError: true, verifySuccess: false
      };
    case FINDING_INVITES:
      return {
        ...state, isLoading: true, findInvitesError: false, findInvitesSuccess: false
      };
    case FIND_INVITE_SUCCESS:
      return {
        ...state, isLoading: false, findInvitesError: false, findInvitesSuccess: true, inviteServersList: action.payload
      };
    case FIND_INVITE_FAIL:
      return {
        ...state, isLoading: false, findInvitesError: true, findInvitesSuccess: false
      };
    case RESET_INVITE_VALUES:
      return {
        ...state, isLoading: false, verifyError: false, verifySuccess: false,
        error: false, success: false, inviteEmailError: false, inviteEmailSuccess: false, inviteCode: null, findInvitesError: false, findInvitesSuccess: false
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

export const inviteVerification = params => async dispatch => {
  dispatch({ type: VERIFYING_SERVER_INVITE });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/inviteVerification`, params);
    if(response.data) {
      dispatch({ type: VERIFY_SERVER_INVITE_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: VERIFY_SERVER_INVITE_FAIL });
    }
  } catch(err) {
    dispatch({ type: VERIFY_SERVER_INVITE_FAIL });
  }
};

export const findInvites = params => async dispatch => {
  dispatch({ type: FINDING_INVITES });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/findInvites`, params);
    if(response.data) {
      dispatch({ type: FIND_INVITE_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: FIND_INVITE_FAIL });
    }
  } catch(err) {
    dispatch({ type: FIND_INVITE_FAIL });
  }
};

export function resetInviteValues() {
  return function(dispatch) {
    dispatch({ type: RESET_INVITE_VALUES });
  };
}
