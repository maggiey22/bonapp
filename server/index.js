const express = require('express');
const path = require('path');
const cors = require('cors');

// const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json()); // parse json

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
/* app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
}); */

// one mistake -- i was using get
// WORKING!
/* app.post('/search', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send(`{"message":"Hello world!", "items": ${req.body.items}}`);
}); */

// working!
// app.post('/search', (req, res) => {
//   console.log("SENDING ITEMS!!!");
//   res.json(req.body.items);
// });

const searchRouter = require('./search');
app.use('/search', searchRouter);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
