const express = require('express');
const glob = require('glob');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const session         = require('express-session');
const flash           = require('connect-flash');
const passport        = require('passport');
const os              = require("os");
const cron            = require('../app/lib/cron');
const helpers            = require('../app/lib/helpers');

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());
  app.use(session({ 
          secret: process.env.SESSION_SECRET || "blabla",
          resave: true,
          saveUninitialized: true,

      })); // session secret

      app.use(passport.initialize());
      app.use(passport.session()); // persistent login sessions
      app.use(flash()); // use connect-flash for flash messages stored in session

  app.locals.moment = require('moment');
  //app.locals.momentTz = require('moment-timezone');
  
  if(os.homedir() == "/Users/ahmedghazi"){
      app.locals.root_url = "http://localhost:3006";
  }else{
      app.locals.root_url = "http://5.196.12.161:3006";
  }

  var controllers = glob.sync(config.root + '/app/controllers/*/*.js');
      controllers.forEach(function (controller) {
        //console.log(controller)
      require(controller)(app);
  });

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

  helpers.init_yt();
/*
    cron.cronStop(function(err, result){
      if (err) return console.log(err);
  console.log("cronStop")
      cron.cronStart(app, function(_err, _result){
        if (_err) return console.log(_err);
        
        console.log("cron result: ",_result)
      });
    });
*/

  return app;
};
