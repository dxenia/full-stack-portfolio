const app = require('./server.js');
const session = require('express-session');
const cors = require('cors');
const crypto = require('crypto');

const generateKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

const secretKey = generateKey();

app.use(cors());
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const adminRoute = require('../src/routes/adminRoute.js');
const careerRoute = require('../src/routes/careerRoute.js');
const inboxRoute = require('../src/routes/inboxRoute.js');
const loginLogoutRoute = require('../src/routes/loginLogoutRoute.js');

app.use(adminRoute);
app.use(careerRoute);
app.use(inboxRoute);
app.use(loginLogoutRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
