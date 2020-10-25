module.exports = (req, res) => {
  res.json({
    body: {
      message: "hello world",
    },
    query: req.query,
    cookies: req.cookies,
  });
};
