/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var TAG = "UserController: ";

module.exports = {
	login: function (req, res) {
		var bcrypt = require('bcrypt');
		var uuid = require('node-uuid');

		User.findOneByPhone(req.body.phone).exec(function (err, user) {
			if (err) res.json({ error: 'DB error' }, 500);

			if (user) {
				return bcrypt.compare(req.body.password, user.password, function (err, match) {
					console.log(TAG + "Attempting login user: " + user.id);
					// TODO: Should create a new apiToken everytime?
					if (err) res.json({ error: 'Server error' }, 500);

					if (match) {
						// password match
						console.log(TAG + "User(" + user.id + ") password check passed");
						console.log("Token: " + user.token);
						if (!user.token || TokenService.isExpired(user.token)) {
							return TokenService.generateToken()
							.then(function (tokenObj) {
								console.log(TAG + "Received new token");
								// created new token
								req.session.userId = user.id;
								return Token.update({apiToken:tokenObj.apiToken}, {user: user.id})
								.then(function(updated) {
									return updated;
								})
								.catch(function(err){
									// Failed assigning token to user
									console.log(TAG + "Failed assigning token to user");
									res.send(500, {
										err: err
									});
								})
							})
							.spread(function(updated){
								console.log(TAG + "Logged in user: " + updated.user);
								return res.json({
									apiToken: updated.apiToken
								});
							})
							.catch(function (err){
								console.log(TAG + "Catching error: " + err);
							})
						} else {
							req.session.userId = user.id;
							return res.json({
								apiToken: user.token
							})
						}

					} else {
						if (req.session.userId) req.session.userId = null;
						res.json({ error: 'Invalid password' }, 400);
					}
				});
			} else {
				res.json({ error: 'User not found, password check failed' }, 404);
			}
		});
	},
	new: function(req, res){
		console.log(TAG + "Creating new user");
		var phone = req.param('phone');
		var password = req.param('password');
		var role = req.param('role');

		if (role=='admin') {
			res.send(404);
		} else {
			TokenService.generateToken()
			.then(function (tokenObj){
				console.log(TAG + "Created new token");
				User.create({
					phone: phone,
					password: password,
					role: role,
					token: tokenObj.apiToken
				})
				.exec(function cb(err, created){
					if (err) {
						console.log(TAG + "Error " + err);
						res.json({error: err}, 500);
					} else if (!err && created) {
						req.session.userId = created.id;
						res.send(created);
					} else {
						console.log(TAG + "Attempted creating new user, failed completely");
						res.send(500, {error: 'Crashing and burning here, contact us asap.'});
					}
				});
			})
			.catch(function (err){
				console.log(TAG + "Failed getting token: " + err);
			})
		}
	},
	newAdmin: function(req, res) {
		console.log(TAG + "Creating new admin");
		var phone = req.param('phone');
		var password = req.param('password');
		var role = req.param('role');

		TokenService.generateToken()
		.then(function (tokenObj){
			console.log(TAG + "Created new token");
			User.create({
				phone: phone,
				password: password,
				role: role,
				token: tokenObj.apiToken
			})
			.exec(function cb(err, created){
				if (err) {
					console.log(TAG + "Error " + err);
					res.json({error: err}, 500);
				} else if (!err && created) {
					req.session.userId = created.id;
					res.send(created);
				} else {
					console.log(TAG + "Attempted creating new user, failed completely");
					res.send(500, {error: 'Crashing and burning here, contact us asap.'});
				}
			});
		})
		.catch(function (err){
			console.log(TAG + "Failed getting token: " + err);
		})
	},
	test: function (req, res) {
		var token = req.param('token');
		var userid = req.param('userId');
	}
}
