let express = require('express');
let app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.listen(3000, () => {
  console.log('Express Server now running on port 3000');
});
