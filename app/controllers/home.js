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
  	return Post
	  	.find({
			"$or": [
		  	{ name : { $regex: req.params.term, $options: 'i' }}
		  //{ link : { $regex: req.params.term, $options: 'i' }},
		  //{ from : { $regex: req.params.term, $options: 'i' }}
			]
	  	})
	  	.sort({updated_time: 'desc'})
	  	.populate({path: 'category'})
	  	.exec(function(err, posts) {
			if (err) {
				console.log(err);
				return next(err);
			}
			if(posts.length){
				//let cat_id = posts[0].category._id
				let where = []
				for(var i in posts){
					where.push({
						_id: posts[i].category._id
					})
				}
				Category
				    //.findOne({_id: posts[0].category._id})
				    .find({ $and: where})
				    .populate({path: 'posts'})
				    .sort({name: 'asc'})
				    //.limit(postsPerPage)
				    .exec(function(err, categories) {
				        if (err) {
				            console.log(err);
				            return next(err);
				        }
				        
				        //return res.json(categories);
				        return res.render('index', {
				        	title: 'MONO MIX',
				          	categories: categories
				        });
				    });
			}else{
				return res.render('index', {
		        	title: 'MONO MIX',
		          	categories: []
		        });
			}
			//console.log(app.get('title'));
			
			/*return res.render('liste', {
				title: 'MONO MIX',
			  	categories: posts
			});*/
  	});
  
});