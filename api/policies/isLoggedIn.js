var log = require('captains-log')();
var TAG = "Policy(isLoggedIn) ";

module.exports = function isLoggedIn (req, res, next) {
    log.info(TAG + "User loggedIn check");
    var apiToken = req.param('apiToken');
    if (!apiToken)
        res.send(401);
    else {
        // TODO: Probably can check if token is expired and if token is matched with user asyncroniously
        log.info(TAG + "apiToken " + apiToken);
        log.info(TAG + "session.userId=" + req.session.userId);
        if (req.session.userId) {
            User.findOne({
                id:req.session.userId,
                apiToken: apiToken
            })
            .then(function (found){
                log.info(TAG + "Token found, checking if expired");
                log.info(found);
                TokenService.isExpired(apiToken)
                .then(function (isExpired){
                    if (!isExpired) {
                        log.info(TAG + "User isLoggedIn moving on...");
                        // user is valid
                        return next();
                    } else {
                        log.info(TAG + "User not found or token mismatch");
                        // token not found or expired
                        return res.send(401);
                    }
                })
                .catch(function (err) {
                    log.info(TAG + "Token expired check failed, err: " + err);
                });
            })
            .catch(function (err){
                log.info(TAG + "User w/ this apiToken not found, err: " + err);
                return next(err);
            });
        } else {
            log.info("userId not in session");
            return res.send(401);
        }
    }
}
