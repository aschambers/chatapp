import axios from 'axios';
import { ROOT_URL } from '../../../config/networkSettings';
import { config } from '../../../config/token';

import {
  CREATING_CATEGORY,
  CREATE_CATEGORY_FAIL,
  CREATE_CATEGORY_SUCCESS,
  FINDING_CATEGORY,
  FIND_CATEGORY_FAIL,
  FIND_CATEGORY_SUCCESS,
  RESET_CATEGORY_VALUES
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
    case CREATING_CATEGORY:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state, isLoading: false, findCategoryError: false, findCategorySuccess: true, categoryList: action.payload
      };
    case CREATE_CATEGORY_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case FINDING_CATEGORY:
      return {
        ...state, isLoading: true, error: false, success: false
      };
    case FIND_CATEGORY_SUCCESS:
      return {
        ...state, isLoading: false, findCategoryError: false, findCategorySuccess: true, categoryList: action.payload
      };
    case FIND_CATEGORY_FAIL:
      return {
        ...state, isLoading: false, error: true, success: false
      };
    case RESET_CATEGORY_VALUES:
      return {
        ...state, isLoading: false, error: false, success: false,
        findCategoryError: false, findCategorySuccess: false
      }
    default:
      return state;
  }
};

// Actions
export const categoryCreate = params => async dispatch => {
  dispatch({ type: CREATING_CATEGORY });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/categoryCreate`, params, config);
    if (response.data) {
      dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: CREATE_CATEGORY_FAIL });
    }
  } catch(err) {
    dispatch({ type: CREATE_CATEGORY_FAIL });
  }
};

export const categoryFindAll = params => async dispatch => {
  dispatch({ type: FINDING_CATEGORY });
  try {
    const response = await axios.post(`${ROOT_URL}/api/v1/categoryFindAll`, params, config);
    if (response.data) {
      dispatch({ type: FIND_CATEGORY_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: FIND_CATEGORY_FAIL });
    }
  } catch(err) {
    dispatch({ type: FIND_CATEGORY_FAIL });
  }
};

export function resetCategoryValues() {
  return function(dispatch) {
    dispatch({ type: RESET_CATEGORY_VALUES });
  };
};
