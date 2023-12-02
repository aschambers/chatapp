import { configureStore } from "@reduxjs/toolkit";

import categoryReducer from './modules/categories/categories';
import chatroomReducer from './modules/chatrooms/chatrooms';
import friendReducer from './modules/friends/friends';
import inviteReducer from './modules/invites/invites';
import serverReducer from './modules/servers/servers';
import userReducer from './modules/users/users';

const store = configureStore({
  reducer: {
    category: categoryReducer,
    charoom: chatroomReducer,
    friend: friendReducer,
    invite: inviteReducer,
    server: serverReducer,
    user: userReducer
  }
});

export default store;
