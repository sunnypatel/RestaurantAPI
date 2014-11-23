var TAG = "Policy: isLoggedIn: ";

module.exports = function isLoggedIn (req, res, next) {
  var apiToken = req.param('apiToken');
  if (req.session.userId) {
    Token.findOne({apiToken:apiToken})
    .then(function (found){
        console.log(TAG + "User auth check passed");
      if (found.user == req.session.userId && !tokenService.isExpired(found)) {
        // user is valid
        return next();
      } else {
        // token not found or expired
        return res.send(401);
      }
    })
    .catch(function (err){
      return next(err);
    });
  } else {
    return res.send(401);
  }
}
