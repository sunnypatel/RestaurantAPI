var TAG = "Policy: isLoggedIn: ";

module.exports = function isLoggedIn (req, res, next) {
    console.log(TAG + "User loggedIn check");
    var apiToken = req.param('apiToken');
    if (!apiToken)
        res.send(401);
    else {
        // TODO: Probably can check if token is expired and if token is matched with user asyncroniously
        console.log(TAG + "apiToken " + apiToken);
        console.log(TAG + "session.userId=" + req.session.userId);
        if (req.session.userId) {
            User.findOne({
                id:req.session.userId,
                apiToken: apiToken
            })
            .then(function (found){
                console.log(TAG + "Token found, checking if expired");
                console.log(found);
                TokenService.isExpired(apiToken)
                .then(function (isExpired){
                    if (!isExpired) {
                        console.log(TAG + "User isLoggedIn moving on...");
                        // user is valid
                        return next();
                    } else {
                        console.log(TAG + "User not found or token mismatch");
                        // token not found or expired
                        return res.send(401);
                    }
                })
                .catch(function (err) {
                    console.log(TAG + "Token expired check failed, err: " + err);
                });
            })
            .catch(function (err){
                console.log(TAG + "User w/ this apiToken not found, err: " + err);
                return next(err);
            });
        } else {
            console.log("userId not in session");
            return res.send(401);
        }
    }
}
