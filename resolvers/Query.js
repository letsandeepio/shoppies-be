const axios = require('axios');
const omdbKey = process.env.OMDB_KEY;
const { sleep } = require('../helpers/sleep');

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

async function getNominations(_, args, context) {
  const { uuid } = args;
  const user = await context.prisma.users.findOne({
    where: { uuid }
  });
  if (!user) throw new Error('No nominations for the given UUID');
  return user.nominations;
}

module.exports = {
  info,
  search,
  getMovieDetails,
  getNominations
};
