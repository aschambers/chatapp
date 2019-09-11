const express = require('express');
const path = require('path');
const busboyBodyParser = require('busboy-body-parser');
// express setup
const app = express();
app.use(busboyBodyParser({ multi: true }));
app.use(express.json());
// cors
const cors = require('cors');
app.use(cors({ credentials: true, origin: true }));
app.options('*', cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// routes
require('./server/routes/userRoutes')(app);
require('./server/routes/messageRoutes')(app);
require('./server/routes/chatroomRoutes')(app);
require('./server/routes/categoryRoutes')(app);
require('./server/routes/serverRoutes')(app);
require('./server/routes/inviteRoutes')(app);
require('./server/routes/friendRoutes')(app);
// client setup
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
// listen for api requests
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, function() {
  console.log('Server is listening on port: ' + PORT);
});
// chatroom
require('./server/chatroom/chatroom')(server);