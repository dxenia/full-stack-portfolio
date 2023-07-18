const express = require('express');
const { join } = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
