module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

//catch err and pass it to next
