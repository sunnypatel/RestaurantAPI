var log = require('captains-log')();
var TAG = "Policy(isRestaurant) ";

module.exports = function isRestaurant (req, res, next) {
    log.info(TAG + "Checking if user is restaurant");
    User.findOne({id:req.session.user.id})
    .then(function (found){
        if (found.role != 'restaurant' && found.role != 'admin') {
            // user is not restaurant
            log.error(TAG + "Access denied to non-restaurant, role="+found.role);
            throw new Error(TAG + "Access denied to non-restaurant, role="+found.role);
            return res.send(401);
        } else {
            // user is restaurant
            return next();
        }
    })
    .catch(function (err){
        return next(err);
    });
}
