var TAG = "Policy isTheRestaurantOwner: ";
module.exports = function isTheRestaurantOwner (req, res, next) {
    var restaurantId = req.param('restaurantId');
    console.log(TAG + "Checking if user owns this restaurant("+restaurantId+")");
    User.findOne({id: req.session.userId})
    .populate('ownsRestaurants',{id:parseInt(restaurantId)})
    .then(function (found){
        if(found.ownsRestaurants.length || found.role == 'admin') {
            console.log(TAG + "Access granted to user("+found.id+") to edit restaurant("+restaurantId+")");
            next();
        }
        else {
            // user does not own this restaurant
            console.log(TAG + "Access denied user("+req.session.userId+") to edit restaurant("+req.param('restaurantId')+")");
            return res.send(401);
        }
    })
    .catch(function (err){
        console.log(TAG + "Access denied user("+req.session.userId+") to edit restaurant("+req.param('restaurantId')+")");
        return res.send(401);
    });
}
