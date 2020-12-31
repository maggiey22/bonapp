const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const app = express();

const path = require('path');
const fs = require("fs");
// const liteYTembedCSS = require('./lite-yt-embed.css');

app.use(cors());
app.use(express.json()); // parse json

// Priority serve any static files.
// app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.get('/supersecretcssendpoint', (req, res) => {
  res.set('Content-Type', 'text/css');
  // const css = fs.readFileSync("./lite-yt-embed.css");
  console.log(path.resolve(__dirname, './lite-yt-embed.css'));
  const css = fs.readFileSync(path.resolve(__dirname, './lite-yt-embed.css'));
  // console.log(css);
  res.send(css);
  // res.send(`{"message":"Hello world!", "items": ${req.}}`);
});

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
// app.get('*', function(request, response) {
//   response.sendFile(path.resolve(__dirname, '../react-ui/public', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
