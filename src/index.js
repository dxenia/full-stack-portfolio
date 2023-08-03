const app = require('./server.js');
const session = require('express-session');
const cors = require('cors');
const crypto = require('crypto');
app.use(cors());

const generateKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

const secretKey = generateKey();

app.set('trust proxy', 1);
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure:
        process.env.NODE_ENV && process.env.NODE_ENV == 'production'
          ? true
          : false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const authenticateUser = (request, response, next) => {
  if (request.session.loggedIn) {
    next();
  } else {
    response
      .status(401)
      .json({ error: 'Access to admin dashboard not authorized.' });
  }
};

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
