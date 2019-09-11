const axios = require('axios');
const keys = require('../config/keys');
const SERVER_URL = keys.server_url;

module.exports = async(server) => {
  let users = [];
  let messages = [];

  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    socket.on('GET_CHATROOM_MESSAGES', async(data) => {
      socket.leave(data.previousRoom);
      socket.join(data.room);
      let messages = await axios.post(`${SERVER_URL}/api/v1/getChatroomMessages`, data) || [];
      io.in(data.room).emit('RECEIVE_CHATROOM_MESSAGES', messages.data.reverse());
    });

    socket.on('GET_PRIVATE_MESSAGES', async(data) => {
      let messages = await axios.post(`${SERVER_URL}/api/v1/getPrivateMessages`, data) || [];
      io.emit('RECEIVE_PRIVATE_MESSAGES', messages.data.reverse());
    });

    socket.on('CHATROOM_MESSAGE', async(data) => {
      let messages = await axios.post(`${SERVER_URL}/api/v1/messageChatroomCreate`, {
        username: data.username,
        message: data.message,
        userId: data.userId,
        chatroomId: data.chatroomId
      });
      if (messages) {
        io.in(data.room).emit('RECEIVE_CHATROOM_MESSAGES', messages.data.reverse());
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
        io.emit('RECEIVE_PRIVATE_MESSAGES', messages.data.reverse());
      }
    });

    socket.on('SEND_USER', function(data) {
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

    socket.on('GET_MESSAGES', async(data) => {
      let messages = await axios.post(`${SERVER_URL}/api/v1/getChatroomMessages`, data) || [];
      if (messages) {
        io.emit('RECEIVE_MESSAGE', messages.data.reverse());
      }
    });

    socket.on('SEND_MESSAGE', async(data) => {
      let messageCreate = await axios.post(`${SERVER_URL}/api/v1/messageCreate`, {
        username: data.username,
        message: data.message,
        type: 'general'
      });
      if(messageCreate) {
        messages.unshift(data);
        io.emit('RECEIVE_MESSAGE', messages);
      }
    });

    socket.on('PRIVATE_MESSAGE', async(data) => {
      for(let i = 0; i < users.length; i++) {
        if(users[i].username === data.from) {
          let messageCreate = await axios.post(`${SERVER_URL}/api/v1/messageCreate`, {
            username: data.from,
            sentTo: data.to,
            message: data.message,
            type: 'private'
          });
          if(messageCreate) {
            users[i].privateMessages.unshift({
              username: data.from,
              sentTo: data.to,
              message: data.message
            });
          }
          break;
        }
      }
      io.emit('RECEIVE_USERS', users);
    });

    socket.on('PERSONAL_MESSAGE', async(data) => {
      for(let i = 0; i < users.length; i++) {
        if(users[i].username === data.to) {
          let messageCreate = await axios.post(`${SERVER_URL}/api/v1/messageCreate`, {
            username: data.to,
            message: data.message,
            type: 'personal'
          });
          if(messageCreate) {
            users[i].personalMessages.unshift({
              username: data.to,
              message: data.message
            });
          }
          break;
        }
      }
      io.emit('RECEIVE_USERS', users);
    });

  });
}