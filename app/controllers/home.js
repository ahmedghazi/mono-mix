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
	          	categories: categories,
	          	theme: ""
	        });
	    });
});

router.get('/theme/:theme', function(req, res, next) {
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
	          	categories: categories,
	          	theme: req.params.theme
	        });
	    });
});


router.get('/s/:term', function (req, res, next) {
  //var skip = parseInt(req.params.id * postsPerPage);
  	return Post
	  	.find({
			"$or": [
		  	{ name : { $regex: req.params.term, $options: 'i' }}
			]
	  	})
	  	.sort({updated_time: 'desc'})
	  	.populate({path: 'category'})
	  	.exec(function(err, posts) {
			if (err) {
				console.log(err);
				return next(err);
			}
			console.log("posts.length",posts.length)
			if(posts.length){
				//let cat_id = posts[0].category._id
				var ids = []
				for(var i in posts){
					ids.push(posts[i].category._id)
				}
				console.log("where",ids)
				Category
				    //.findOne({_id: posts[0].category._id})
				    .find({ _id: { $in:ids } })
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
		
  	});
  
});