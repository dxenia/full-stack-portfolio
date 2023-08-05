const app = require('./server.js');
const session = require('express-session');
const cors = require('cors');
const crypto = require('crypto');
app.use(cors());

const generateKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

const secretKey = generateKey();
// console.log(secretKey);

app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SECRET_KEY || secretKey,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 48,
      sameSite: 'none',
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
