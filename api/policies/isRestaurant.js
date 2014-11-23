var TAG = "Policy isRestaurant: ";
module.exports = function isRestaurant (req, res, next) {
    User.findOneId(req.session.userId)
    .then(function (found){
        if (found.role != 'restaurant' || found.role != 'admin') {
            // user is not restaurant
            console.log(TAG + "Access denied to non-restaurant");
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
