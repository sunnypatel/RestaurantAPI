/**
 * ItemController
 *
 * @description :: Server-side logic for managing Items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var log = require('captains-log')();
var CTAG = "ItemController";

module.exports = {
	create: function(req, res){
		var TAG = CTAG + "(create) ";
		var restaurantId = req.body.restaurantId;
		if (!restaurantId) { return res.json({error: 'Required field missing'}); }
		var name = req.body.name;
		var price = req.body.price;
		var description = req.body.description;
		var image = req.body.image || 'http://placehold.it/140x100' ;
		var tags = req.body.tags;
		var ingredients = req.body.ingredients;


		log.info(TAG + 'Attempting to create item, for restaurant:' + restaurantId);
		Item.create({
			name: name,
			price: price,
			description: description,
			restaurantId: restaurantId,
			image: image,
			tags: tags,
			ingredients: ingredients
		})
		.then(function (created){
			log.info(TAG + "Created new item");
			res.send(200, created);
		})
		.catch(function (err) {
			log.error(TAG + "Error creating new item: " + err);
			res.send(500);
		})
	},
	imageUpload: function(req, res) {
		var itemId = req.param('itemId');
		var AWS = require('aws-sdk');
		var fs = require('fs');
		var uuid = require('node-uuid');

		Item.findOne({
			id: itemId
		})
		.then(function (item){
			req.file('image').upload({
				maxBytes: 300000000
			}, function whenDone(err, uploadedFiles) {
				if (err) {
					return res.negotiate(err);
				}
				// If no files were uploaded, response with error
				if (uploadedFiles.length === 0){
	      			return res.badRequest('No file was uploaded');
	   			}
				var file = fs.readFileSync(uploadedFiles[0].fd);
			    var s3 = new AWS.S3();
			    var uuid1 = uuid.v1({
					node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
					clockseq: 0x1234,
					msecs: new Date().getTime(),
					nsecs: 5678
				});
			    var filename = uuid1 + '.' + uploadedFiles[0].filename.split('.').pop();
			    var bucketName = 'restaurantapi';
			    var keyName = 'itemImages' + '/' + item.restaurantId + '/' + filename;
		      	s3.createBucket({
		      		Bucket: bucketName
		      	}, function() {
		      		var param = {Bucket: bucketName, Key: keyName, Body: file, ACL: 'public-read'};
		      		s3.putObject(param, function(err, data){
		      			if (err)
		      				res.serverError(err);
		      			else {
		      				var successObj = {
		      					url: 'https://s3.amazonaws.com/' + bucketName + '/' + keyName
		      				}
		      				Item.update({
		      					id: item.id
		      				}, {
		      					image: successObj.url
		      				})
		      				.exec(function afterWards(err, update){
		      					if (err) {
		      						res.serverError(err);
		      					} else {
		      						res.ok(update);
		      					}
		      				})
		      			}
		      		})
		      	});
			})
		})
		.catch(function(err){
			res.serverError(err);
		});
	}
};
