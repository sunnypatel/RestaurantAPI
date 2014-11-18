module.exports = function isAdmin (req, res, next) {
  User.findOneId(req.session.userId)
  .then(function (found){
    if (found.role != 'admin') {
      // user is not admin
      return res.send(401);
    } else {
      // user is admin
      return next();
    }
  })
  .catch(function (err){
    return next(err);
  });

}
