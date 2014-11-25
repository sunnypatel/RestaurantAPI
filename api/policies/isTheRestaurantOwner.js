var TAG = "Policy isTheRestaurantOwner: ";
module.exports = function isTheRestaurantOwner (req, res, next) {
    console.log(TAG + "Checking if user owns this restaurant");
    Restaurant.findOne({
      id: req.param('restaurantId'),
      owner:req.session.userId
    })
    .then(function (found){
        console.log(TAG + "Access granted to user("+req.session.userId+") to edit restaurant("+req.param('restaurantId')+")");
        next();
    })
    .catch(function (err){
        console.log(TAG + "Access denied user("+req.session.userId+") to edit restaurant("+req.param('restaurantId')+")");
        return next(err);
    });
}
