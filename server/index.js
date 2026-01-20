const server = require('./app');

server.listen(3000, function() {
  console.log('Server is listening on http://localhost:3000');
});

//console.log(typeof server); If it returns function then it means it successfully returned the Express app. 