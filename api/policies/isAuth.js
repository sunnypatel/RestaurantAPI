module.exports = function isAuth (req, res, next) {
  var apiToken = req.param('apiToken');
  var userId = req.param('userId');

  User.findOneById(userId).exec(function(err, user){
      if (err) res.json({ error: 'DB error' }, 500);

      if (user) {
        
        if(user.apiToken == apiToken) {

        }
      }
  })
}
