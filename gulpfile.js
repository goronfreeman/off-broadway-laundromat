var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    cp           = require('child_process'),
    concat       = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    sass         = require('gulp-sass');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('sass', function() {
  return gulp.src('assets/css/main.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('assets/css'));
});

// Autoprefix CSS
gulp.task('css', function() {
  return gulp.src('assets/css/main.css')
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
});

// Concatenate JS
gulp.task('scripts', function() {
  return gulp.src('assets/js/*.js')
  .pipe(concat('main.js'))
  .pipe(gulp.dest('assets/js'))
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
  gulp.watch('assets/css/*.scss', ['sass', 'css', 'jekyll-rebuild']);
  gulp.watch('assets/js/*.js', ['scripts', 'jekyll-rebuild']);
  gulp.watch(['index.html', '_config.yml', '_layouts/*', '_includes/*', '_posts/*', 'assets/*'], ['jekyll-rebuild']);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'browser-sync', 'watch']);
