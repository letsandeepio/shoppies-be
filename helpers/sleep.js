function sleep(amount) {
  return new Promise((resolve) => setTimeout(resolve, amount * 1000));
}

module.exports = {
  sleep
};
