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

		if (!req.body.phone || !req.body.password)
			res.send(401, {error: 'Missing fields'});
		else {
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
							console.log("Token: " + user.apiToken);
							TokenService.isExpired(user.apiToken)
							.then(function (isExpired){
								console.log(TAG + "Token expired:" + isExpired);
								if (!isExpired) {
									console.log(TAG + "Everything checks out, heres ur token");
									req.session.userId = user.id;
									return res.json({
										apiToken: user.apiToken
									})
								}
								else {
									console.log(TAG + "Attempting to create new token");
									return TokenService.generateToken()
									.then(function (tokenObj) {
										console.log(TAG + "Received new token");
										// created new token
										req.session.userId = user.id;
										return User.update({id: user.id}, {apiToken: tokenObj.apiToken})
										.then(function(updated) {
											return updated;
										})
										.catch(function(err){
											// Failed updating user's apiToken
											console.log(TAG + "Failed assigning token to user");
											res.send(500, { err: err });
										});
									})
									.then(function(updated){
										console.log(TAG + "Logged in user: " + updated);
										return res.json({
											apiToken: updated.apiToken
										});
									})
									.catch(function (err){
										console.log(TAG + "Generating token failed, err: " + err);
									})
								}
							})
							.catch(function (err) {
								console.log(TAG + 'Token expired check failed, err: ' + err);
							});
						} else {
							if (req.session.userId) req.session.userId = null;
							res.json({ error: 'Invalid password' }, 400);
						}
					});
				} else {
					res.json({ error: 'User not found, password check failed' }, 404);
				}
			});
		}

	},
	new: function(req, res){
		console.log(TAG + "Creating new user");
		var phone = req.param('phone');
		var password = req.param('password');
		var role = req.param('role');

		if (role=='admin' || !phone || !password) {
			res.send(500, {error: 'Missing fields'});
		} else {
			TokenService.generateToken()
			.then(function (tokenObj){
				console.log(TAG + "Created new token");
				User.create({
					phone: phone,
					password: password,
					role: role,
					apiToken: tokenObj.apiToken
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

		if (!phone || !password) {
			res.send(401);
		} else {
			TokenService.generateToken()
			.then(function (tokenObj){
				console.log(TAG + "Created new token");
				User.create({
					phone: phone,
					password: password,
					role: role,
					apiToken: tokenObj.apiToken
				})
				.exec(function cb(err, created){
					if (err) {
						console.log(TAG + "Error " + err);
						res.json({error: err}, 500);
					} else if (!err && created) {
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
	apiToken: function(req, res) {
		console.log(TAG + '/apiToken');
		var apiToken = req.param('apiToken');
		if (!apiToken) {
			console.log(TAG + "Missing fields");
			res.send(401);
		}
		else {
			User.findOne({
				apiToken: apiToken
			})
			.populate('ownsRestaurants')
			.then(function (found){
				console.log(TAG + "Token found, checking if expired");
				console.log(found);
				TokenService.isExpired(apiToken)
				.then(function (isExpired){
					if (isExpired === false) {
						console.log(TAG + "User isLoggedIn returning block");
						delete found.password;
						delete found.createdAt;
						delete found.updatedAt;
						delete found.id;
						// user is valid
						return res.send(200, found);
					} else {
						console.log(TAG + "User not found or token mismatch");
						// token not found or expired
						return res.send(401);
					}
				})
				.catch(function (err){
					console.log(TAG + "Token isExpired check failed, err: " + err);
					return res.send(500);
				})
			})
			.catch(function (err){
				console.log(TAG + "apiToken not found : " + err);
				return res.send(500);
			});
		}
	}
}
