var TAG = "Policy: isLoggedIn: ";

module.exports = function isLoggedIn (req, res, next) {
    console.log(TAG + "User loggedIn check");
    var apiToken = req.param('apiToken');
    if (!apiToken)
        res.send(401);
    else {
        console.log(TAG + "apiToken " + apiToken);
        console.log(TAG + "session.userId=" + req.session.userId);
        if (req.session.userId) {
            User.findOne({
                id:req.session.userId,
                token: apiToken
            })
            .then(function (found){
                console.log(TAG + "Token found, checking if expired");
                console.log(found);
                if (!TokenService.isExpired(apiToken)) {
                    console.log(TAG + "User isLoggedIn moving on...");
                    // user is valid
                    return next();
                } else {
                    console.log("User not found or token mismatch");
                    // token not found or expired
                    return res.send(401);
                }
            })
            .catch(function (err){
                console.log(TAG + "Error: " + err);
                return next(err);
            });
        } else {
            console.log("userId not in session");
            return res.send(401);
        }
    }
}
