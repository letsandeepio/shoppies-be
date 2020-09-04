const axios = require('axios');
const omdbKey = process.env.OMDB_KEY;

function info() {
  return `This is the backend GraphQL server for the Shoppie Awards App`;
}

async function search(_, args) {
  console.log('searching for ' + args.title);
  const results = await axios.get(
    `http://www.omdbapi.com/?s=${args.title}&apikey=${omdbKey}&type=movie`
  );
  await sleep(1);
  return results.data.Search;
}

async function getMovieDetails(_, args) {
  const results = await axios.get(
    `http://www.omdbapi.com/?i=${args.imdbID}&apikey=${omdbKey}`
  );
  await sleep(1);
  return results.data;
}

function sleep(amount) {
  return new Promise((resolve) => setTimeout(resolve, amount * 1000));
}

module.exports = {
  info,
  search,
  getMovieDetails
};
