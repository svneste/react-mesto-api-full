const allowedCors = [
  'https://facebook.nomoredomains.icu/',
  'localhost:3000'
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
};
