var log = require('captains-log')();
var TAG = "Policy(isTokenValid) ";

module.exports = function isTokenValid (req, res, next) {
    var apiToken = req.body.apiToken || req.param('apiToken');
    if (!apiToken) {
        res.send(401);
    }
    else {
        log.info(TAG + "apiToken " + apiToken);
        // Look up token with this apitoken
        Token.findOne({apiToken: apiToken})
        .then(function (tokenObj) {
            // Check if token is expired
            TokenService.isExpired(tokenObj.apiToken)
            .then(function(isExpired){
                if (isExpired) {
                    // Token is expired
                    log.error(TAG + "Token expired");
                    throw new Error(TAG + "User not found or token mismatch");
                    // token not found or expired
                    return res.send(401);
                }
            })
            .then(function () {
                User.findOne({apiToken: tokenObj.apiToken})
                .then(function (user){
                    // Everything checks out
                    req.session.user = user;
                    log.info(TAG + "User added to session");
                    next();
                })
                .catch(function (err){
                    // User not found with this token
                    log.info(TAG + "User not found");
                    throw new Error(TAG + "User not found");
                    return res.send(401);
                })
            })
            .catch(function (err) {
                log.error(TAG + "Token expired check failed, err: " + err);
                return next(err);
            });
        })
        .catch(function (err){
            log.info(TAG + "User w/ this apiToken not found, err: " + err);
            return next(err);
        });
    }
}
