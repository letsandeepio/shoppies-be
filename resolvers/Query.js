const axios = require('axios');
const omdbKey = process.env.OMDB_KEY;
const { sleep } = require('../helpers/sleep');

function info() {
  return `This is the backend GraphQL server for the Shoppie Awards App`;
}

async function search(_, args) {
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
  return results.data;
}

async function getNominations(_, args, context) {
  const { uuid } = args;
  const user = await context.prisma.users.findOne({
    where: { uuid }
  });
  if (!user) throw new Error('No nominations are avaiable at this moment :(');
  await sleep(2);
  return { nominations: user.nominations, nominatedBy: user.name };
}

module.exports = {
  info,
  search,
  getMovieDetails,
  getNominations
};
