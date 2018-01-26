var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async'),
    Options = mongoose.model('Options'),
    Post = mongoose.model('Post'),
    Category = mongoose.model('Category'),
    Users = mongoose.model('Users'),
    request = require('request'),
    //fs = require("fs"),
    extract = require('meta-extractor'),
    //webshot = require('node-webshot'),
    slug = require('slug'),
    //moment = require('moment'),
    FB = require('fb'),
    Youtube = require('youtube-node'),
    //color = require('dominant-color'),
    moment = require('moment'),
    momentDurationFormatSetup = require("moment-duration-format"),

    fbApp,
    client_id,
    client_secret,
    token,
    root_url,
    page_id,
    youTube;


exports.test = function(next) {
    return next("helpers");
};

exports.set_root_url = function(url) {
    root_url = url;
};

exports.init_yt = function(callback) {
    youTube = new Youtube();
    youTube.setKey('AIzaSyBMcFRVdw_jipl7LMlnP-87PpOet7uNN8c');
    //console.log(youTube)
    //callback();
};

exports.init_fb = function() {
    client_id = '398286323958628';
    client_secret = '926f16496c7e71988cd8a827c9ea0ba0';
    fbApp = FB.extend({
        appId: client_id,
        appSecret: client_secret
    });
};



exports.init_timestamp = function(callback) {
    var self = this;

    var time = new Date();
    var unix = Math.round(time / 1000)

    callback(unix)
    
    Post
        .find()
        .limit(5)
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
            if (posts.length == 0) {
                var unix = "1513728000";
            } else {
                var time = new Date(last.updated_time);
                var unix = Math.round(time / 1000)
            }

            //return res.json(unix)
            self.updateOptions("last_post_timestamp", unix, function(____err, resp) {
                callback(unix)
            });
        });


};


exports.collect = function(min, callback) {
    var self = this;
    console.log("=========================")
    console.log("collect start")
    /*var d = new Date();
        d.setHours(0,0,0,0);
    var max = Math.round(d/1000);*/
    console.log("min: ", min)

    FB.setAccessToken('398286323958628|IrwxIREQmoqa0x8G2zTIj7AmzP8');
    FB.api('187700331331992/feed?limit=10&&fields=id,message,name,caption,description,updated_time,link,from,type', function(_res) {
        if (!_res || _res.error) {
            console.log(!_res ? 'error occurred' : _res.error);
        }

        self.process(min, _res);
    });
};

exports.process = function(min, _res) {
    var self = this;
    if (!_res || _res.error) {
        console.log(!_res ? 'error occurred' : _res.error);
        return res.send(_res.error);
    }

    console.log("length", _res.data.length)

    async.each(_res.data,
        function(_post, callback) {
            if (_post.type == "video" && _post.link && _post.message) {
       
                //console.log("--- now < post", min < Math.round(+new Date(_post.updated_time) / 1000),min )
                if(min != ""){
                    if (Math.round(+new Date(_post.updated_time) / 1000) > min){
                        self.record(_post, function(){
                            callback();
                        });
                    }else{
                        
                        _res.paging = null;
                        callback();
                    }
                }else{
                    
                    self.record(_post, function(){
                        callback();
                    });
                    
                }
            } else {
                callback();
            }
        },
        function(err) {

            if (_res.paging && _res.paging.next != "undefined") {
                var options = {
                    method: 'GET',
                    url: _res.paging.next,
                };

                request(options, function(error, response, body) {
                    if (error) throw new Error(error);
                    //console.log("statusCode", response.statusCode);
                    //console.log(body);
                    self.process(min, JSON.parse(body))
                }).setMaxListeners(0);
            } else {
                console.log("record done, paging empty")
                //self.set_total();
            }
        }
    );
};

exports.record = function(_post, callback) {
    var self = this;

    if(_post.message.toLowerCase().indexOf("theme") == -1){
        callback();
    }else if(_post.link.indexOf("youtube") == -1){
        callback();
    }else{
        //console.log("link        : "+_post.link)
        //console.log("description : "+_post.description)
        //console.log("message     : "+_post.message)
        //var theme = _post.message.replace(/theme/gi, "");
        //console.log("_post.message",_post.message)
        //var regex = /THEME\s(\w+)/g;
        var regex = /(?<=\btheme\s)(\w+)/i;
        var matches = _post.message.match(regex);
        if(!matches){
            var regex = /(?<=\btheme:\s)(\w+)/i;
            matches = _post.message.match(regex);
        }
        if(!matches){
            var regex = /(?<=\btheme :\s)(\w+)/i;
            matches = _post.message.match(regex);
        }
        if(!matches){
            var regex = /(?<=\btheme  :\s)(\w+)/i;
            matches = _post.message.match(regex);
        }
        
        if(!matches){
            callback();
        }else{
            //if(matches && matches.length > 0)
            console.log("theme     : ",matches[0])
            var theme = matches[0];
            var query = {name: theme}
            var update = {name: theme}
            Category.findOneAndUpdate(query, update, {
                upsert: true,
                'new': true
            }, function(err, category, raw) {
                //console.log(category)
                var query = {name: _post.from.name}
                var update = {name: _post.from.name}
                Users.findOneAndUpdate(query, update, {
                    upsert: true,
                    'new': true
                }, function(err, user, raw) {
                    //console.log(user)

                    self.get_yt_data(_post.link, function(result) {
                        //console.log(result)
                        var query = {link: _post.link}

                        var postNameClean = self.clean(_post.name)
                        console.log(_post.name, postNameClean)
                        var update = {
                            fbid: _post.id,
                            type: _post.type,
                            name: postNameClean,
                            message: _post.message,
                            description: _post.description,
                            updated_time: _post.updated_time,
                            link: _post.link,
                            duration: result.duration,
                            image: result.image,
                            videoId: result.videoId,
                            user: user,
                            category: category
                        }
                        Post.findOneAndUpdate(query, update, {
                            upsert: true,
                            'new': true
                        }, function(err, post, raw) {
                            
                            var query = {name: theme}
                            var update = {$addToSet: {posts: post}}

                            Category.findOneAndUpdate(query, update, {
                                upsert: true,
                                'new': true
                            }, function(err, category, raw) {
                                callback();
                            });
                        });
                    });

                    
                });
            });

            //callback();

        }
    }
    
    
};

exports.clean = function(name) {
    //name = name.replace("http", "");
    //name = name.replace("https", "");
    name = name.replace(/\n/g, "");
    name = name.replace(/ : /g, "");
    name = name.replace(/:/g, "");
    name = name.replace(/(https?:\/\/[^\s]+)/g, '');
    return name;
};

exports.set_total = function() {
    var self = this;
    Post
        .find()
        .exec(function(err, posts) {
            self.updateOptions("total_posts", posts.length, function(err, resp) {
                console.log(posts.length)
            });
        });
};

exports.updateOptions = function(key, value, callback) {
    Options.findOneAndUpdate({
            'meta.key': key
        }, {
            'meta.value': value
        }, {
            upsert: true,
            'new': false
        },
        function(err, options, raw) {
            if (err) {
                return console.log(err);
            }

            callback(err, {
                success: true
            });
        });
};

exports.get_yt_data = function(url, callback) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    
    youTube.getById(match[2], function(error, result) {
        if(error)console.log(error)

        var duration = result.items[0].contentDetails.duration;
        var dur = moment.duration(duration).format("ss");
        
        var image = result.items[0].snippet.thumbnails.high.url;
        callback({
            duration: dur,
            image: image,
            videoId: match[2]
        })
        
    });
};

