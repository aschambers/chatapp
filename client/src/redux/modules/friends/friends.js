import axios from 'axios';
import { ROOT_URL } from '../../../config/networkSettings';

import {
  CREATING_FRIEND,
  CREATE_FRIEND_FAIL,
  CREATE_FRIEND_SUCCESS,
  DELETING_FRIEND,
  DELETE_FRIEND_FAIL,
  DELETE_FRIEND_SUCCESS,
  FINDING_FRIENDS,
  FIND_FRIENDS_FAIL,
  FIND_FRIENDS_SUCCESS,
  RESET_FRIEND_VALUES
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
    case CREATING_FRIEND:
      return {
        ...state, isLoading: true, createFriendError: false, createFriendSuccess: false
      };
    case CREATE_FRIEND_SUCCESS:
      return {
        ...state, isLoading: false, createFriendError: false, createFriendSuccess: true, friendsList: action.payload
      };
    case CREATE_FRIEND_FAIL:
      return {
        ...state, isLoading: false, createFriendError: true, createFriendSuccess: false
      };
    case DELETING_FRIEND:
      return {
        ...state, isLoading: true, deleteFriendError: false, deleteFriendSuccess: false
      };
    case DELETE_FRIEND_SUCCESS:
      return {
        ...state, isLoading: false, deleteFriendError: false, deleteFriendSuccess: true, friendsList: action.payload
      };
    case DELETE_FRIEND_FAIL:
      return {
        ...state, isLoading: false, deleteFriendError: true, deleteFriendSuccess: false
      };
    case FINDING_FRIENDS:
      return {
        ...state, isLoading: true, findFriendsError: false, findFriendsSuccess: false
      };
    case FIND_FRIENDS_SUCCESS:
      return {
        ...state, isLoading: false, findFriendsError: false, findFriendsSuccess: true, friendsList: action.payload
      };
    case FIND_FRIENDS_FAIL:
      return {
        ...state, isLoading: false, findFriendsError: true, findFriendsSuccess: false
      };
    case RESET_FRIEND_VALUES:
      return {
        ...state, isLoading: false, createFriendError: false, createFriendSuccess: false, deleteFriendError: false, deleteFriendSuccess: false, findFriendsError: false, findFriendsSuccess: false
      };
    default:
      return state;
  }
};

// Actions
export const friendCreate = params => async dispatch => {
  dispatch({ type: CREATING_FRIEND });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/friendCreate`, params);
    if (response.data) {
      dispatch({ type: CREATE_FRIEND_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: CREATE_FRIEND_FAIL });
    }
  } catch(err) {
    dispatch({ type: CREATE_FRIEND_FAIL });
  }
};

export const friendDelete = params => async dispatch => {
  dispatch({ type: DELETING_FRIEND });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/friendDelete`, params);
    if (response.data) {
      dispatch({ type: DELETE_FRIEND_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: DELETE_FRIEND_FAIL });
    }
  } catch(err) {
    dispatch({ type: DELETE_FRIEND_FAIL });
  }
};

export const findFriends = params => async dispatch => {
  dispatch({ type: FINDING_FRIENDS });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/findFriends`, params);
    if (response.data) {
      dispatch({ type: FIND_FRIENDS_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: FIND_FRIENDS_FAIL });
    }
  } catch(err) {
    dispatch({ type: FIND_FRIENDS_FAIL });
  }
};

export function resetFriendValues() {
  return function(dispatch) {
    dispatch({ type: RESET_FRIEND_VALUES });
  };
}
