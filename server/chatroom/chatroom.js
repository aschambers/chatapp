const axios = require('axios');
const keys = require('../config/keys');
const SERVER_URL = keys.server_url;

module.exports = async(server) => {
  let users = [];
  let messages = [];
  let setChatMessages = false;
  // run only on server initial start
  let setItems = async() => {
    if(!setChatMessages) {
      setChatMessages = true;
      let getMessages = await axios.get(`${SERVER_URL}/api/v1/getMessages`);
      if(getMessages.data) {
        let newMessages = [];
        for(let k = 0; k < getMessages.data.length; k++) {
          if(getMessages.data[k].type === 'general') {
            newMessages.push(getMessages.data[k]);
          }
        }
        messages = newMessages;
        let getUsers = await axios.get(`${SERVER_URL}/api/v1/getUsers`);
        if(getUsers.data) {
          let newUsers = [];
          for(let i = 0; i < getUsers.data.length; i++) {
            if(getMessages.data && getMessages.data.length) {
              for(let j = 0; j < getMessages.data.length; j++) {
                if(getUsers.data[i].username === getMessages.data[j].username && !getUsers.data[i].privateMessages && getMessages.data[j].type === 'private') {
                  getUsers.data[i].privateMessages = [{
                    username: getMessages.data[j].username,
                    sentTo: getMessages.data[j].sentTo,
                    message: getMessages.data[j].message
                  }];
                } else if(getUsers.data[i].username === getMessages.data[j].username && !getUsers.data[i].privateMessages && getMessages.data[j].type === 'personal') {
                  getUsers.data[i].personalMessages = [{
                    username: getMessages.data[j].username,
                    sentTo: getMessages.data[j].sentTo,
                    message: getMessages.data[j].message
                  }];
                } else if(getUsers.data[i].username === getMessages.data[j].username && getMessages.data[j].type === 'private') {
                  getUsers.data[i].privateMessages.push({
                    username: getMessages.data[j].username,
                    sentTo: getMessages.data[j].sentTo,
                    message: getMessages.data[j].message
                  });
                } else if(getUsers.data[i].username === getMessages.data[j].username && getMessages.data[j].type === 'personal') {
                  getUsers.data[i].personalMessages.push({
                    username: getMessages.data[j].username,
                    sentTo: getMessages.data[j].sentTo,
                    message: getMessages.data[j].message
                  });
                } else if(!getUsers.data[i].personalMessages && !getUsers.data[i].privateMessages) {
                  getUsers.data[i].personalMessages = [];
                  getUsers.data[i].privateMessages = [];
                } else if(!getUsers.data[i].personalMessages) {
                  getUsers.data[i].personalMessages = [];
                } else if(!getUsers.data[i].privateMessages) {
                  getUsers.data[i].privateMessages = [];
                }
              }
              newUsers.push(getUsers.data[i]);
            } else {
              getUsers.data[i].privateMessages = [];
              getUsers.data[i].personalMessages = [];
              newUsers.push(getUsers.data[i]);
            }
          }
          users = newUsers;
          return true;
        }
      }
    } else {
      return true;
    }
  }
  // wait for chatroom to setup first
  await setItems();

  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
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

    socket.on('GET_MESSAGES', function() {
      io.emit('RECEIVE_MESSAGE', messages);
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