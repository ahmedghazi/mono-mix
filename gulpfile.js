const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const livereload = require('gulp-livereload');
const sass = require('gulp-ruby-sass');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const stripDebug = require('gulp-strip-debug');

gulp.task('sass', () => {
  return sass('./public/css/**/*.scss')
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

/*gulp.task('scripts', function() {
    gulp.src(['./public/js/*.js'])
      .pipe(concat('functions.js'))
      .pipe(rename({suffix: '.min'}))
      //.pipe(stripDebug())//remove logs
      //.pipe(uglify())
      .pipe(gulp.dest('./public/js'));
});*/

gulp.task('scriptsCustom', function() {
    gulp.src(['./public/js/*.js'])
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(stripDebug())//remove logs
      .pipe(uglify())
      .pipe(gulp.dest('./public/js/dist/'));
});

gulp.task('scriptsVendor', function() {
    gulp.src(['./public/js/vendor/jquery.min.js','./public/js/vendor/modernizr.min.js'])
      .pipe(concat('vendor.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(stripDebug())//remove logs
      .pipe(uglify())
      .pipe(gulp.dest('./public/js/dist/'));
});


gulp.task('watch', () => {
  gulp.watch('./public/css/*.scss', ['sass']);
  gulp.watch('./public/js/*.js', ['scriptsCustom']);
  gulp.watch('./public/js/vendor/*.js', ['scriptsVendor']);
});

gulp.task('develop', () => {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee jade',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', (chunk) => {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'scriptsCustom',
  'scriptsVendor',
  'develop',
  'watch'
]);
