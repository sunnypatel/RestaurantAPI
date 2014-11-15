/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
	login: function (req, res) {
		var bcrypt = require('bcrypt');
		var uuid = require('node-uuid');

		User.findOneByPhone(req.body.phone).exec(function (err, user) {
			if (err) res.json({ error: 'DB error' }, 500);

			if (user) {
				bcrypt.compare(req.body.password, user.password, function (err, match) {
					if (err) res.json({ error: 'Server error' }, 500);

					if (match) {
						// password match
						req.session.user = user.id;
						req.session.apiToken = uuid.v1();
						User.update({
							apiToken:req.session.apiToken,
						})
						res.json({"userId": user.id, "apiToken": req.session.apiToken});
					} else {
						// invalid password
						if (req.session.user) req.session.user = null;
						res.json({ error: 'Invalid password' }, 400);
					}
				});
			} else {
				res.json({ error: 'User not found' }, 404);
			}
		});
	},
	new: function(req, res){
		var password = req.param('password');
		var phone = req.param('phone');
		var accountType = req.param('accountType');

		User.create({
			phone: phone,
			password: password,
			accountType: accountType
		}).
		exec(function cb(err, created){
			res.send(created);
		});
	},
}
