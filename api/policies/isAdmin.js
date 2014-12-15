var log = require('captains-log')();
var TAG = "Policy(isAdmin) ";

module.exports = function isAdmin (req, res, next) {
    User.findOne({id: req.session.user.id})
    .then(function (found){
    if (found.role != 'admin') {
        // user is not admin
        log.info(TAG + "Access denied to non-admin");
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
