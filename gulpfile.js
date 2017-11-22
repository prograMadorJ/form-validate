var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    browserify = require('gulp-browserify'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence');

var srcSass = 'assets/sass/*.scss';
var destSass = 'assets/css';

gulp.task('sass', function () {
    return gulp.src(srcSass)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', swallowError)) // Converts Sass to CSS with gulp-sass
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(destSass))
});

var srcJS = 'assets/js';
var destJS = srcJS;

gulp.task('js', function () {
    // Single entry point to browserify
    gulp.src([srcJS])
        .pipe(browserify())
        .pipe(gulp.dest(destJS))
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
});

gulp.task('sync',function () {
        runSequence('dev','browserSync');
    }
);

gulp.task('dev', function () {
    gulp.src(srcSass)
        .pipe(sass())
        .on('error', swallowError)
        .pipe(gulp.dest(destSass));
    gulp.src([srcJS])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .on('error', swallowError)
        .pipe(gulp.dest(destJS))
});

gulp.task('dev-w', ['sync'], function () {
    gulp.watch([srcSass], ['dev',browserSync.reload]);
    gulp.watch('*.html', browserSync.reload);
});

function swallowError(error) {
    // If you want details of the error in the console
    console.log(error.toString());
    this.emit('end')
}