var TAG = "Policy(isRestaurant) ";
module.exports = function isRestaurant (req, res, next) {
    console.log(TAG + "Checking if user is restaurant");
    User.findOne({id:req.session.userId})
    .then(function (found){
        if (found.role != 'restaurant' && found.role != 'admin') {
            // user is not restaurant
            console.log(TAG + "Access denied to non-restaurant, role="+found.role);
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
