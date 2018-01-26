var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    //Posts = mongoose.model('Post'),
    //mailer = require('../../lib/mailer'),
    _app;

module.exports = function (app) {
    _app = app;

    app.use('/admin/category', isAuthenticated, router);
};

var isAuthenticated = function (req, res, next) {
    //return next();
    if (req.isAuthenticated())
        return next();
        res.redirect('/security/login');
    
    return next();
}

router.get('/all', function (req, res, next) {
    Category
        .find()
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, category) {
        //.find(function (err, posts) {
            if (err) return next(err);
            return res.send(Category);
            
    });
});

router.get('/', function (req, res, next) {
    Category
        .find()
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, categories) {
        //.find(function (err, posts) {
            if (err) return next(err);
         
            res.render('admin/category/category', {
                title: 'Category',
                categories: categories,
                admin: req.category
            });
    });
});


router.get('/new', function (req, res, next) {
    return res.render('admin/category/category-new', {
        title: 'Ajouter un utilisateur',
        admin: req.category
    });
});



router.post('/new', function (req, res, next) {
    console.log(req.body)
    var category = new Category(req.body);
    category.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.redirect('admin/category/');
        
    });
});

router.get('/edit/:id', function (req, res, next) {
    Category
        .findOne({_id: req.params.id})
        //.populate({path: 'image enfants Category_in'})
        .exec(function(err, category) {
        //.find(function (err, posts) {
            if (err) return next(err);

            res.render('admin/category/category-edit', {
                title: 'Category',
                category: category,
                admin: req.category
            });
        });
});

router.post('/edit/:id', function (req, res, next) {
    Category.findOne({ _id: req.params.id }, function(err, category) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            category[prop] = req.body[prop];
        }

        category.save(function(_err) {
            if (_err) {
                return res.send(_err);
            }

            res.redirect('/admin/category')
        });
    });
});

router.get('/delete/:id', function (req, res, next) {
    Category.remove({
        _id: req.params.id
    }, function(err, category) {
        if (err) {
          return res.send(err);
        }

        res.redirect('/admin/category/');
    });
});

router.get('/Category-in-table', function (req, res, next) {
    Category
        .find({category_type: "invite"})
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, category) {
        //.find(function (err, posts) {
            if (err) return next(err);
         
            res.render('admin/category/category-in-table', {
                title: 'Category',
                Category: Category,
                //admin: req.category
            });
    });
});
