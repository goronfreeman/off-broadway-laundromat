var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    cp           = require('child_process'),
    concat       = require('gulp-concat'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCss    = require('gulp-concat-css'),
    cssnano      = require('gulp-cssnano'),
    sass         = require('gulp-sass'),
    imagemin     = require('gulp-imagemin');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('sass', function() {
  return gulp.src('assets/css/main.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('assets/css'));
});

// Autoprefix, Concat, & Minify CSS
gulp.task('css', function() {
  return gulp.src('assets/css/main.css')
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(cssnano())
  .pipe(gulp.dest('assets/css'))
  .pipe(rename('main.min.css'))
  .pipe(gulp.dest('assets/css'))
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('assets/js/*.js')
  .pipe(concat('main.js'))
  .pipe(gulp.dest('assets/js'))
  .pipe(rename('main.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('assets/js'));
});

// Minify Images
gulp.task('images', function() {
  return gulp.src('assets/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('assets/img'));
});

// Build the Jekyll Site
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// Rebuild Jekyll & Reload Page
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

// Wait for jekyll-build, then launch the server
gulp.task('browser-sync', ['jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

// Watch Files for Changes
gulp.task('watch', function() {
  gulp.watch('assets/css/*.scss', ['sass', 'css']);
  gulp.watch('assets/js/*.js', ['scripts']);
  gulp.watch(['index.html', '_config.yml', '_layouts/*', '_includes/*', '_posts/*', '_assets/*'], ['jekyll-rebuild']);
});

// Default Task
gulp.task('default', ['sass', 'css', 'scripts', 'images', 'browser-sync', 'watch']);
