const axios = require('axios');
const keys = require('../config/keys');
const SERVER_URL = keys.server_url;

module.exports = async(server) => {
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    socket.on('LEAVE_CHATROOMS', async(data) => {
      socket.leave(data.room);
      socket.disconnect(true);
    });

    socket.on('GET_CHATROOM_MESSAGES', async(data) => {
      socket.leave(data.previousRoom);
      socket.join(data.room);
      let messages = await axios.post(`${SERVER_URL}/api/v1/getChatroomMessages`, data) || [];
      io.to(data.socketId).emit('RECEIVE_CHATROOM_MESSAGES', messages.data);
    });

    socket.on('CHATROOM_MESSAGE', async(data) => {
      let messages = await axios.post(`${SERVER_URL}/api/v1/messageChatroomCreate`, {
        username: data.username,
        message: data.message,
        userId: data.userId,
        chatroomId: data.chatroomId
      });
      if (messages) {
        io.in(data.room).emit('RECEIVE_CHATROOM_MESSAGES', messages.data);
      }
    });

    socket.on('DELETE_CHATROOM_MESSAGE', async(data) => {
      let messages = await axios.post(`${SERVER_URL}/api/v1/messageChatroomDelete`, {
        chatroomId: data.chatroomId,
        messageId: data.messageId
      });
      if (messages) {
        io.in(data.room).emit('RECEIVE_CHATROOM_MESSAGES', messages.data);
      }
    });

    socket.on('EDIT_CHATROOM_MESSAGE', async(data) => {
      let messages = await axios.post(`${SERVER_URL}/api/v1/messageChatroomEdit`, {
        chatroomId: data.chatroomId,
        messageId: data.messageId,
        message: data.message
      });
      if (messages) {
        io.in(data.room).emit('RECEIVE_CHATROOM_MESSAGES', messages.data);
      }
    });

    socket.on('GET_PERSONAL_MESSAGES', async(data) => {
      socket.leave(data.previousRoom);
      socket.join(data.room);
      let messages = await axios.post(`${SERVER_URL}/api/v1/getPersonalMessages`, data) || [];
      io.to(data.socketId).emit('RECEIVE_PERSONAL_MESSAGES', messages.data);
    });

    socket.on('GET_PRIVATE_MESSAGES', async(data) => {
      socket.leave(data.previousRoom);
      socket.join(data.room);
      let messages = await axios.post(`${SERVER_URL}/api/v1/getPrivateMessages`, data) || [];
      io.to(data.socketId).emit('RECEIVE_PRIVATE_MESSAGES', messages.data);
    });

    socket.on('SEND_PERSONAL_MESSAGE', async(data) => {
      let messages = await axios.post(`${SERVER_URL}/api/v1/messagePersonalCreate`, {
        username: data.username,
        message: data.message,
        userId: data.userId,
        friendId: data.friendId
      });
      if (messages) {
        io.in(data.room).emit('RECEIVE_PERSONAL_MESSAGES', messages.data);
      }
    });

    socket.on('SEND_PRIVATE_MESSAGE', async(data) => {
      let messages = await axios.post(`${SERVER_URL}/api/v1/messagePrivateCreate`, {
        username: data.username,
        message: data.message,
        userId: data.userId,
        friendId: data.friendId
      });
      if (messages) {
        io.in(data.room).emit('RECEIVE_PRIVATE_MESSAGES', messages.data);
      }
    });

    socket.on('DELETE_USER_MESSAGE', async(data) => {
      if (data.userId === data.friendId) {
        const messages = await axios.post(`${SERVER_URL}/api/v1/messagePersonalDelete`, {
          userId: data.userId,
          friendId: data.friendId,
          messageId: data.messageId
        });
        io.to(data.socketId).emit('RECEIVE_PERSONAL_MESSAGES', messages.data);
      } else if (data.userId !== data.friendId) {
        const messages = await axios.post(`${SERVER_URL}/api/v1/messagePrivateDelete`, {
          userId: data.userId,
          friendId: data.friendId,
          messageId: data.messageId
        });
        io.to(data.socketId).emit('RECEIVE_PRIVATE_MESSAGES', messages.data);
      }
    });

    socket.on('EDIT_USER_MESSAGE', async(data) => {
      if (data.userId === data.friendId) {
        let messages = await axios.post(`${SERVER_URL}/api/v1/messagePersonalEdit`, {
          userId: data.userId,
          friendId: data.friendId,
          messageId: data.messageId,
          message: data.message
        });
        io.in(data.room).emit('RECEIVE_PERSONAL_MESSAGES', messages.data);
      } else if (data.userId !== data.friendId) {
        let messages = await axios.post(`${SERVER_URL}/api/v1/messagePrivateEdit`, {
          userId: data.userId,
          friendId: data.friendId,
          messageId: data.messageId,
          message: data.message
        });
        io.in(data.room).emit('RECEIVE_PRIVATE_MESSAGES', messages.data);
      }
    });

    socket.on('KICK_SERVER_USER', async(data) => {
      let userList = await axios.post(`${SERVER_URL}/api/v1/kickServerUser`, {
        serverId: data.serverId,
        type: data.type,
        userId: data.userId
      });
      if (userList) {
        io.in(data.room).emit('RECEIVE_SERVER_LIST', userList.data);
      }
    });

    socket.on('BAN_SERVER_USER', async(data) => {
      let userList = await axios.post(`${SERVER_URL}/api/v1/banServerUser`, {
        serverId: data.serverId,
        type: data.type,
        userId: data.userId
      });
      if (userList) {
        io.in(data.room).emit('RECEIVE_SERVER_LIST', userList);
      }
    });



    // user actions
    socket.on('SEND_USER', function(data) {
      let users = [];
      if(users.length > 0) {
        const result = users.filter((item) => {
          return (item.username === data.username);
        });
        if(result.length === 0) {
          users.push(data);
          io.emit('RECEIVE_USERS', users);
        } else if(result.length !== 0) {
          for(let i = 0; i < users.length; i++) {
            if(users[i].username === data.username) {
              users[i].active = true;
              break;
            }
          }
          io.emit('RECEIVE_USERS', users);
        }
      } else if(users.length < 1) {
        users.push(data);
        io.emit('RECEIVE_USERS', users);
      }
    });

    socket.on('LOGOUT_USER', function(data) {
      let users = [];
      for(let i = 0; i < users.length; i++) {
        if(users[i].username === data.username) {
          users[i].active = false;
          io.emit('RECEIVE_LOGOUT', users);
          break;
        }
      }
    });

    socket.on('GET_USERS', function() {
      io.emit('RECEIVE_USERS', users);
    });

  });
}