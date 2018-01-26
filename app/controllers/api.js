var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category'),
    request = require('request'),
    //fs = require("fs"),
    async = require('async'),
    extract = require('meta-extractor'),
    helpers = require('../lib/helpers'),
    webshot = require('node-webshot'),
    slug = require('slug'),
    FB = require('fb'),
    moment = require('moment'),
    momentDurationFormatSetup = require("moment-duration-format"),
    fbApp,
    client_id,
    client_secret,
    app;

module.exports = function(_app) {
    client_id = '398286323958628';
    client_secret = '926f16496c7e71988cd8a827c9ea0ba0';
    fbApp = FB.extend({
        appId: client_id,
        appSecret: client_secret
    });

    app = _app;
    app.use('/api', router);
};

router.get('/', function(req, res, next) {
    res.send("api")
});

router.get('/setup', function (req, res, next) {
    var body = {
        email:"admin",
        password:"passssap",
        type:"admin"
    }

    var user = new Users(body);
    user.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.redirect('/');
    });
    
});

router.get('/cat-all', function (req, res, next) {
    return Category
        .find()
        //.populate({path: 'user category'})
        .sort({name: 'desc'})
        //.limit(postsPerPage)
        .exec(function(err, posts) {
            if (err) {
                console.log(err);
                return next(err);
            }
            //console.log(app.get('title'));
            return res.json(posts);
        });
});

router.get('/oauth', function(req, res, next) {
    FB.api('oauth/access_token', {
        client_id: client_id,
        client_secret: client_secret,
        grant_type: 'client_credentials'
    }, function(_res) {
        if (!_res || _res.error) {
            console.log(!_res ? 'error occurred' : _res.error);
            return;
        }

        var accessToken = _res.access_token;
        console.log(accessToken)
        //398286323958628|IrwxIREQmoqa0x8G2zTIj7AmzP8
        return res.send(accessToken)
    });
});



router.get('/last', function(req, res, next) {
    Post
        .find()
        .limit(10)
        .sort({
            "updated_time": -1
        })
        //.limit(postsPerPage)
        .exec(function(err, posts) {
            if (err) {
                console.log(err);
                return next(err);
            }
            var last = posts[0];
            var time = new Date(last.updated_time);
            var unix = Math.round(time / 1000)
            //return res.json(unix)
            Options.findOneAndUpdate({
                    'meta.key': 'first_post_timestamp'
                }, {
                    'meta.value': unix
                }, {
                    upsert: true,
                    'new': false
                },
                function(err, options, raw) {
                    if (err) {
                        return console.log(err);
                    }

                    //callback(err, {success:true});
                });

        });

});

router.get('/all-posts', function(req, res, next) {
    helpers.collect("", function() {
        console.log("collect callback")
    });
});

router.get('/last-posts', function(req, res, next) {
    //helpers.set_root_url(app.locals.root_url)
    helpers.init_timestamp(function(time) {
        helpers.collect(time, function() {
            console.log("collect callback")
        });
    });
});
/*
router.get('/yt', function(req, res, next) {
    helpers.get_yt_data("https://www.youtube.com/watch?v=Dbe_DIv_Ja0", function(result) {
        return res.json(result)
    });
});*/

router.get('/count', function(req, res, next) {
    helpers.set_total();
});







router.get('/drop', function(req, res, next) {
    req.resetDb();
    res.redirect("/api");
    //res.send("done")
});

/*
mongodump --db sniff-development
mongorestore --db sniff-development ./sniff-development
*/