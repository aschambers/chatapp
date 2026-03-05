const express = require('express');
const helmet = require('helmet');
const path = require('path');
const fileUpload = require('express-fileupload');

// express setup
const app = express();
const auth = require('./server/middleware/auth');

// cors
const cors = require('cors');
const whitelist = ['https://chattersanctum.com', 'http://localhost:3000', 'http://localhost:5001'];
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
}
app.use(cors(corsOptions));
app.options('*', cors());

app.use(helmet());
app.use(auth);
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(express.json());

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

// sync database tables and start server
const sequelize = require('./server/config/connection');
require('./server/models/User');

const PORT = process.env.PORT || 5001;
sequelize.sync().then(() => {
  const server = app.listen(PORT, function() {
    console.log('Server is listening on port: ' + PORT);
  });
  require('./server/chatroom/chatroom')(server);
});