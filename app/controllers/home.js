const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', function(req, res, next) {
	return Category
	    .find()
	    .populate({path: 'posts'})
	    .sort({name: 'asc'})
	    //.limit(postsPerPage)
	    .exec(function(err, categories) {
	        if (err) {
	            console.log(err);
	            return next(err);
	        }
	        //console.log(app.get('title'));
	        //return res.json(posts);
	        res.render('index', {
	        	title: 'MONO MIX',
	          	categories: categories
	        });
	    });
});

router.get('/s/:term', function (req, res, next) {
  //var skip = parseInt(req.params.id * postsPerPage);
  	return Category
	  	.find({
			"$or": [
		  	{ name : { $regex: req.params.term, $options: 'i' }}
		  //{ link : { $regex: req.params.term, $options: 'i' }},
		  //{ from : { $regex: req.params.term, $options: 'i' }}
			]
	  	})
	  	.sort({updated_time: 'desc'})
	  	.exec(function(err, posts) {
			if (err) {
				console.log(err);
				return next(err);
			}
			//console.log(app.get('title'));
			return res.render('liste', {
				title: 'MONO MIX',
			  	categories: posts
			});
  	});
  
});