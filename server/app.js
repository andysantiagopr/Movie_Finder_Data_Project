const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const axios = require('axios');
const app = express();
const apiKey = process.env.API_KEY;

app.use(morgan('dev')); //Log requests. It shows more info than the tiny format. Specific for devs. 

// Simple in-memory cache using Map
// Map is a built-in JS data structure that allows fast lookups
// We use it to store previous API responses so we don’t call OMDb again
const cache = new Map();

app.get("/", async (req, res) => {
  // This route is marked async so we can use `await` for the axios request
  // The cache lets us reuse data from previous requests instead of refetching it
  //'/' determines which route handles the request

  // Use the full request URL as a unique key (ex: "/?t=batman"). You need a unique key for each different request so you can cache correctly. 
  const key = req.originalUrl;

  // If this request was already made before, return the cached data
  if (cache.has(key)) {
    return res.status(200).send(cache.get(key));
  }

  // If not cached, fetch the data from the OMDb API
  //Axios is a JS library for making HTTP reqs from external APIs. The reason Axios is async is because it does not return data directly, it returns a Promise. 
  //Axios is a better fetch(). With fetch() it would look like this: 
  /*fetch(url)
    .then(res => res.json())
    .then(data => console.log(data)); */

  const response = await axios.get(
    'http://www.omdbapi.com/' + key + '&apikey=' + apiKey //Creates a dynamic request url
  );

  // Store the response data in the cache for future requests
  cache.set(key, response.data);

  // Send the fetched data back to the client
  res.status(200).send(response.data);
});



module.exports = app;
