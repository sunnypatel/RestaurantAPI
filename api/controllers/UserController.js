/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var CTAG = "UserController";

module.exports = {
	login: function (req, res) {
		TAG = CTAG + '(Login) ';
		var bcrypt = require('bcrypt');
		var uuid = require('node-uuid');

		if (!req.body.phone || !req.body.password)
			res.send(401, {error: 'Missing fields'});
		else {
			User.findOneByPhone(req.body.phone).exec(function (err, user) {
				if (err) res.json({ error: 'DB error' }, 500);

				if (user) {
					bcrypt.compare(req.body.password, user.password, function (err, match) {
						console.log(TAG + "Attempting login user("+user.id+")");
						if (err) res.json({ error: 'Server error' }, 500);

						if (match) {
							// password match
							console.log(TAG + "User("+user.id+") password check passed");

							TokenService.isExpired(user.apiToken)
							.then(function (isExpired){
								if (isExpired) {
									// token is expired
									console.log(TAG + "Token is expired");
									throw new Error('Expired Token');
								} else {
									req.session.userId = user.id;
									// token not expired send old one
									res.json({
										apiToken: user.apiToken
									});
									// Fulfill your promise man!
									return user.apiToken;
								}
							})
							.catch(function (err) {
								// Token expired or not found, either way create a new token
								TokenService.createTokenObj()
								.then(function (tokenObj) {
									// created new token obj
									console.log(TAG + "Received new tokenObj");
									user.apiToken = tokenObj.apiToken;
									user.save(function(err){
										if (err)
											console.log(TAG + "Unable to update user token, err:" + err);
										else
											console.log(TAG + "Updated user with new token");
									});

									tokenObj.loggedUser = user.id;
									tokenObj.save(function(err){
										if (err)
											console.log(TAG + "Unable to update Token.loggedUser, err:" + err);
										else
											console.log(TAG + "Updated token with userId");
									});
									req.session.userId = user.id;
									res.json({apiToken: user.apiToken}, 200);
								})
								.catch(function(err){
									console.log("Something went wrong");
									res.json({err: err}, 500);
								})
							})
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
		var TAG = CTAG + "(new) ";
		console.log(TAG + "Creating new user");
		var phone = req.param('phone');
		var password = req.param('password');
		var role = req.param('role');

		if (role=='admin' || !phone || !password) {
			res.send(500, {error: 'Missing fields'});
		} else {
			TokenService.createTokenObj()
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
	newAdmin: function(req, res) {
		var TAG = CTAG + "(newAdmin) ";
		var phone = req.param('phone');
		var password = req.param('password');
		var role = req.param('role');

		if (!phone || !password) {
			res.send(401);
		} else {
			TokenService.createTokenObj()
			.then(function (tokenObj){
				console.log(TAG + "Received new token");
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
						throw new Error("Creating new user failed");
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
		var TAG = CTAG + "(apiToken) ";
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
