const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json()); // parse json

const searchRouter = require('./search');
app.use('/search', searchRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

/*
// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

// one mistake -- i was using get
// WORKING!
app.post('/search', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send(`{"message":"Hello world!", "items": ${req.body.items}}`);
});

// working!
app.post('/search', (req, res) => {
  console.log("SENDING ITEMS!!!");
  res.json(req.body.items);
});
*/