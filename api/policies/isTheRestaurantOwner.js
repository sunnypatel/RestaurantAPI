var log = require('captains-log')();
var TAG = "Policy(isTheRestaurantOwner) ";

module.exports = function isTheRestaurantOwner (req, res, next) {
    var restaurantId = req.param('restaurantId');
    log.info(TAG + "Checks for Restaurant("+restaurantId+")");
    User.findOne({id: req.session.userId})
    .populate('ownsRestaurants',{id:parseInt(restaurantId)})
    .then(function (found){
        if(found.ownsRestaurants.length || found.role == 'admin') {
            log.info(TAG + "Access granted to user("+found.id+") to edit restaurant("+restaurantId+")");
            next();
        }
        else {
            // user does not own this restaurant
            log.info(TAG + "Access denied user("+req.session.userId+") to edit restaurant("+req.param('restaurantId')+")");
            return res.send(401);
        }
    })
    .catch(function (err){
        log.info(TAG + "Access denied user("+req.session.userId+") to edit restaurant("+req.param('restaurantId')+")");
        return res.send(401);
    });
}
