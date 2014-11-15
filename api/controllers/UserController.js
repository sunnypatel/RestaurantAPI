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
				return bcrypt.compare(req.body.password, user.password, function (err, match) {
					if (err) res.json({ error: 'Server error' }, 500);

					if (match) {
						// password match
						tokenService.generateToken()
						.then(function (tokenObj) {
							console.log("UserController Generated new token done");
							// created new token
							req.session.user = user.id;
							req.session.apiToken = tokenObj.apiToken;
							return Token.update({id:tokenObj.id}, {user: user.id})
							.then(function(updated) {
								return updated;
							})
							.catch(function(err){
								// Failed assigning token to user
								console.log("failed assigning token to user");
								res.send(500, {
									err: err
								});
							})
						})
						.spread(function(updated){
							console.log("in spread" + updated);
							return res.json({
								userId: updated.user,
								apiToken: updated.apiToken
							});
						})
						.catch(function (err){
							console.log("idk why im here");
						})
					} else {
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
		var phone = req.param('phone');
		var password = req.param('password');
		var role = req.param('role');
		var token = tokenService.generateToken();

		User.create({
			phone: phone,
			password: password,
			role: role,
			token: token.id
		}).
		exec(function cb(err, created){
			console.log("exec");
			console.log("err:" + err);
			if (err) {
				res.json({ error: err}, 500);
			} else if (!err && created) {
				res.send(created);
			} else {
				res.send(500, {error: 'Crashing and burning here, contact us asap'});
			}
		});
	},
	test: function (req, res) {
		tokenService.generateToken();
		res.send(200);
	}
}
