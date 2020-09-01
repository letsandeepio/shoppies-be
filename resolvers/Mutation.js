const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const hashedPassword = require('../helpers/hashedPassword');
const { APP_SECRET } = require('../helpers/constants');

const omdbKey = process.env.OMDB_KEY;

async function signup(_, args, context) {
  console.log(`Signup received from ${context.request.get('Client')}`);

  const hashPw = hashedPassword(args.password);
  let user;
  let token;
  let error = '';

  try {
    user = await context.prisma.users.create({
      data: {
        name: args.name,
        password: hashPw,
        email: args.email
      }
    });
    token = jwt.sign({ userId: user.id }, APP_SECRET);
  } catch (e) {
    error = e.message;
    console.log(error);
  }
  return {
    token,
    user,
    error
  };
}

async function login(_, args, context) {
  console.log(`Login received from ${context.request.get('Client')}`);

  let error = '';
  let token = '';

  const user = await context.prisma.users.findOne({
    where: { email: args.email }
  });

  if (user) {
    const valid = await bcrypt.compare(args.password, user.password);
    if (valid) {
      token = jwt.sign({ userId: user.id }, APP_SECRET);
    } else {
      error = 'Invalid Credentials.';
    }
  } else {
    error = "User doesn't exist.";
  }

  return {
    token,
    user,
    error
  };
}

async function search(_, args) {
  console.log('searching for ' + args.title);
  const results = await axios.get(
    `http://www.omdbapi.com/?s=${args.title}&apikey=${omdbKey}&type=movie`
  );
  return results.data.Search;
}

module.exports = {
  signup,
  login,
  search
};
