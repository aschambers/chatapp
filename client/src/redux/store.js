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
    chatroom: chatroomReducer,
    friend: friendReducer,
    invite: inviteReducer,
    server: serverReducer,
    user: userReducer
  }
});

export * from './modules/categories/categories';
export * from './modules/chatrooms/chatrooms';
export * from './modules/friends/friends';
export * from './modules/invites/invites';
export * from './modules/servers/servers';
export * from './modules/users/users';

export default store;
