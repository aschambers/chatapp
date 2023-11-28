const express = require('express');
const helmet = require('helmet');
const path = require('path');
const busboyBodyParser = require('busboy-body-parser');

// express setup
const app = express();
const auth = require('./server/middleware/auth');
app.use(helmet());
app.use(auth);
app.use(busboyBodyParser({ limit: '50mb', multi: true }));
app.use(express.json());

// cors
const cors = require('cors');
const whitelist = ['https://chattersanctum.com'];
const corsOptions = {
  origin: whitelist && whitelist.indexOf(origin) > -1,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
}
app.use(cors(corsOptions));
app.options('*', cors());

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