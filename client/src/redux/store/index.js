import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import usersReducer from '../modules/users/users';
import chatroomsReducer from '../modules/chatrooms/chatrooms';
import serversReducer from '../modules/servers/servers';

export default function configureStore() {
  const reducers = combineReducers({
    usersReducer,
    chatroomsReducer,
    serversReducer
  });
  const store = createStore(reducers, applyMiddleware(thunk));
  return store;
}
