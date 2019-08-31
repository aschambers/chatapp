import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import usersReducer from '../modules/users/users';
import chatroomsReducer from '../modules/chatrooms/chatrooms';
import categoriesReducer from '../modules/categories/categories';
import serversReducer from '../modules/servers/servers';
import invitesReducer from '../modules/invites/invites';

export default function configureStore() {
  const reducers = combineReducers({
    usersReducer,
    chatroomsReducer,
    categoriesReducer,
    serversReducer,
    invitesReducer
  });
  const store = createStore(reducers, applyMiddleware(thunk));
  return store;
}
