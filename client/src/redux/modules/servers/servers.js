import axios from 'axios';
import { ROOT_URL } from '../../../config/networkSettings';
import { config, authToken } from '../../../config/token';

import {
  CREATING_SERVER,
  CREATE_SERVER_FAIL,
  CREATE_SERVER_SUCCESS,
  FINDING_SERVER,
  FIND_SERVER_FAIL,
  FIND_SERVER_SUCCESS,
  FINDING_SERVER_BANS,
  FIND_SERVER_BANS_FAIL,
  FIND_SERVER_BANS_SUCCESS,
  UNBANNING_USER,
  UNBAN_USER_FAIL,
  UNBAN_USER_SUCCESS,
  DELETING_SERVER,
  DELETE_SERVER_FAIL,
  DELETE_SERVER_SUCCESS,
  UPDATING_USER_ROLE,
  UPDATE_USER_ROLE_FAIL,
  UPDATE_USER_ROLE_SUCCESS,
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
        ...state, isLoading: false, createServerError: false, createServerSuccess: true
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
        ...state, isLoading: false, findServerError: false, findServerSuccess: true, serverUserList: action.payload
      };
    case FIND_SERVER_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case FINDING_SERVER_BANS:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case FIND_SERVER_BANS_SUCCESS:
      return {
        ...state, isLoading: false, findBansError: false, findBansSuccess: true, serverUserBans: action.payload
      };
    case FIND_SERVER_BANS_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case UNBANNING_USER:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case UNBAN_USER_SUCCESS:
      return {
        ...state, isLoading: false, unbanUserError: false, unbanUserSuccess: true, serverUserBans: action.payload
      };
    case UNBAN_USER_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case DELETING_SERVER:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case DELETE_SERVER_SUCCESS:
      return {
        ...state, isLoading: false, deleteServerError: false, deleteServerSuccess: true
      };
    case DELETE_SERVER_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case RESET_SERVER_VALUES:
      return {
        ...state, isLoading: false, error: false, success: false, findServerError: false, findServerSuccess: false, unbanUserError: false, unbanUserSuccess: false, findBansError: false, findBansSuccess: false, createServerError: false, createServerSuccess: false, deleteServerError: false, deleteServerSuccess: false
      };
    case UPDATING_USER_ROLE:
      return {
        ...state, isLoading: true, updateRoleError: false, updateRoleSuccess: false
      };
    case UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state, isLoading: false, updateRoleError: false, updateRoleSuccess: true, serverUserList: action.payload
      };
    case UPDATE_USER_ROLE_FAIL:
      return {
        ...state, isLoading: false, updateRoleError: true, updateRoleSuccess: false
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
      config: {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': authToken
        }
      }
    });
    if (response.data) {
      dispatch({ type: CREATE_SERVER_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: CREATE_SERVER_FAIL });
    }
  } catch(err) {
    dispatch({ type: CREATE_SERVER_FAIL });
  }
};

export const findUserBans = params => async dispatch => {
  dispatch({ type: FINDING_SERVER_BANS });
  try {
    const response = await axios.get(`${ROOT_URL}/api/v1/findUserBans`, { params: params }, config);
    if (response.data) {
      dispatch({ type: FIND_SERVER_BANS_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: FIND_SERVER_BANS_FAIL });
    }
  } catch(err) {
    dispatch({ type: FIND_SERVER_BANS_FAIL });
  }
};

export const unbanUser = params => async dispatch => {
  dispatch({ type: UNBANNING_USER });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/unbanUser`, params, config);
    if (response.data) {
      dispatch({ type: UNBAN_USER_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: UNBAN_USER_FAIL });
    }
  } catch(err) {
    dispatch({ type: UNBAN_USER_FAIL });
  }
}

export const findUserList = params => async dispatch => {
  dispatch({ type: FINDING_SERVER });
  try {
    const response = await axios.get(`${ROOT_URL}/api/v1/findUserList`, { params: params }, config);
    if (response.data) {
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
    const response = await axios.delete(`${ROOT_URL}/api/v1/serverDelete`, { data: params }, config);
    if (response.data) {
      dispatch({ type: DELETE_SERVER_SUCCESS });
    } else {
      dispatch({ type: DELETE_SERVER_FAIL });
    }
  } catch (err) {
    dispatch({ type: DELETE_SERVER_FAIL });
  }
};

export const updateUserRole = params => async dispatch => {
  dispatch({ type: UPDATING_USER_ROLE });
  try {
    const response = await axios.put(`${ROOT_URL}/api/v1/updateUserRole`, params, config);
    if (response.data) {
      dispatch({ type: UPDATE_USER_ROLE_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: UPDATE_USER_ROLE_FAIL });
    }
  } catch (err) {
    dispatch({ type: UPDATE_USER_ROLE_FAIL });
  }
};

export function resetServerValues() {
  return function(dispatch) {
    dispatch({ type: RESET_SERVER_VALUES });
  };
}
