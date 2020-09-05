const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const hashedPassword = require('../helpers/hashedPassword');
const { APP_SECRET } = require('../helpers/constants');
const { sleep } = require('../helpers/sleep');
const { getUserId } = require('../helpers/getUserId');

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
    console.log(e.message);
  }

  await sleep(1);

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

  await sleep(1);

  return {
    token,
    user,
    error
  };
}

async function nominate(_, args, context) {
  const id = getUserId(context);

  const nominations = args.nominations;
  const uuid = uuidv4().split('-').pop();

  await context.prisma.users.update({
    where: { id },
    data: { uuid, nominations }
  });

  await sleep(2);

  return {
    url: uuid
  };
}

module.exports = {
  signup,
  login,
  nominate
};
