import axios from 'axios';
import { ROOT_URL } from '../../../config/networkSettings';

import {
  CREATING_SERVER,
  CREATE_SERVER_FAIL,
  CREATE_SERVER_SUCCESS,
  FINDING_SERVER,
  FIND_SERVER_FAIL,
  FIND_SERVER_SUCCESS,
  DELETING_SERVER,
  DELETE_SERVER_FAIL,
  DELETE_SERVER_SUCCESS,
  RESET_SERVER_VALUES
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
    case CREATING_SERVER:
      return {
        ...state, isLoading: true, createServerError: false, createServerSuccess: false
      };
    case CREATE_SERVER_SUCCESS:
      return {
        ...state, isLoading: false, createServerError: false, createServerSuccess: true, serversList: action.payload
      };
    case CREATE_SERVER_FAIL:
      return {
        ...state, isLoading: false, createServerError: true, createServerSuccess: false
      };
    case FINDING_SERVER:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case FIND_SERVER_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, serverUserList: action.payload
      };
    case FIND_SERVER_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case DELETING_SERVER:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case DELETE_SERVER_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true, user: action.payload
      };
    case DELETE_SERVER_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case RESET_SERVER_VALUES:
      return {
        ...state, isLoading: false, error: false, success: false
      };
    default:
      return state;
  }
};

// Actions
export const serverCreate = params => async dispatch => {
  dispatch({ type: CREATING_SERVER });
  try {
    const response = await axios({
      method: 'post',
      url: `${ROOT_URL}/api/v1/serverCreate`,
      data: params,
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    });
    if(response.data) {
      dispatch({ type: CREATE_SERVER_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: CREATE_SERVER_FAIL });
    }
  } catch(err) {
    dispatch({ type: CREATE_SERVER_FAIL });
  }
};

export const serverFind = params => async dispatch => {
  dispatch({ type: FINDING_SERVER });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/serverFind`, params);
    if(response.data) {
      dispatch({ type: FIND_SERVER_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: FIND_SERVER_FAIL });
    }
  } catch(err) {
    dispatch({ type: FIND_SERVER_FAIL });
  }
};

export const findUserList = params => async dispatch => {
  dispatch({ type: FINDING_SERVER });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/findUserList`, params);
    if(response.data) {
      dispatch({ type: FIND_SERVER_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: FIND_SERVER_FAIL });
    }
  } catch(err) {
    dispatch({ type: FIND_SERVER_FAIL });
  }
};

export const serverDelete = params => async dispatch => {
  dispatch({ type: DELETING_SERVER });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/serverDelete`, params);
    if (response.data) {
      dispatch({ type: DELETE_SERVER_SUCCESS });
    } else {
      dispatch({ type: DELETE_SERVER_FAIL });
    }
  } catch (err) {
    dispatch({ type: DELETE_SERVER_FAIL });
  }
};

export function resetServerValues() {
  return function(dispatch) {
    dispatch({ type: RESET_SERVER_VALUES });
  };
}
