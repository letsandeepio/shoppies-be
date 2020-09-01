const hashedPassword = require('../helpers/hashedPassword');
const bcrypt = require('bcrypt');
const { APP_SECRET } = require('../helpers/constants');
const jwt = require('jsonwebtoken');

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

module.exports = {
  signup,
  login
};
