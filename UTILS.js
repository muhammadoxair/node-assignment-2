function isEmail(email) {
  var regex =
    /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(regex)) {
    return true;
  }
  return false;
}

module.exports = { isEmail };
