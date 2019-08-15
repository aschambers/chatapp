import axios from 'axios';
import { ROOT_URL } from '../../../config/networkSettings';

import {
  CREATING_CHATROOM,
  CREATE_CHATROOM_FAIL,
  CREATE_CHATROOM_SUCCESS,
  DELETING_CHATROOM,
  DELETE_CHATROOM_FAIL,
  DELETE_CHATROOM_SUCCESS,
  GETTING_CHATROOMS,
  GET_CHATROOMS_FAIL,
  GET_CHATROOMS_SUCCESS
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
    case CREATING_CHATROOM:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case CREATE_CHATROOM_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true
      };
    case CREATE_CHATROOM_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case DELETING_CHATROOM:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case DELETE_CHATROOM_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true
      };
    case DELETE_CHATROOM_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case GETTING_CHATROOMS:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case GET_CHATROOMS_SUCCESS:
      return {
        ...state, isLoading: false, error: false, success: true
      };
    case GET_CHATROOMS_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    default:
      return state;
  }
};

// Actions
export const createChatroom = params => async dispatch => {
  dispatch({ type: CREATING_CHATROOM });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/createChatroom`, params);
    if(response.data) {
      dispatch({ type: CREATE_CHATROOM_SUCCESS });
    } else {
      dispatch({ type: CREATE_CHATROOM_FAIL });
    }
  } catch(err) {
    dispatch({ type: CREATE_CHATROOM_FAIL });
  }
};

export const deleteChatroom = params => async dispatch => {
  dispatch({ type: DELETING_CHATROOM });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/deleteChatroom`, params);
    if (response.data) {
      dispatch({ type: DELETE_CHATROOM_SUCCESS });
    } else {
      dispatch({ type: DELETE_CHATROOM_FAIL });
    }
  } catch (err) {
    dispatch({ type: DELETE_CHATROOM_FAIL });
  }
};

export const getChatrooms = params => async dispatch => {
  dispatch({ type: GETTING_CHATROOMS });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/getChatrooms`, params);
    if (response.data) {
      dispatch({ type: GET_CHATROOMS_SUCCESS });
    } else {
      dispatch({ type: GET_CHATROOMS_FAIL });
    }
  } catch (err) {
    dispatch({ type: GET_CHATROOMS_FAIL });
  }
};
