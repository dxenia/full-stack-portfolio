const app = require('./server.js');
const routes = require('./routes.js');

app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
