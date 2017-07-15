var gulp = require('gulp');
var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var minifyCss = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var svgSprite = require('gulp-svg-sprite');
var reload = browserSync.reload;
var buildDelete = require('del');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var moduleBlockFix = require('./moduleBlockFix');

var processors = [
    autoprefixer({browsers: ['last 3 version']}),
    moduleBlockFix
];

var paths = {
    html: ['src/pug/*.pug'],
    css: ['src/styl/*.styl'],
    svg: ['src/svg/*.svg']
};

gulp.task('html', function () {
    return gulp.src(paths.html)
        .pipe(pug())
        .pipe(gulp.dest('build'))
        .pipe(reload({stream: true}));
});

gulp.task('mincss', function () {
    return gulp.src(paths.css)
        .pipe(stylus({compress: true}))
        .pipe(postcss(processors))
        .pipe(gulp.dest('build/css'))
        .pipe(minifyCss())
        .pipe(reload({stream: true}));
});

gulp.task('svg', function () {
    gulp.src('src/svg/*.svg')
        .pipe(svgSprite(
            config = {
                shape : {
                    dimension : { // Set maximum dimensions
                        maxWidth : 32,
                        maxHeight : 32
                    },
                    spacing : { // Add padding
                        padding : 10
                    },
                    dest	: 'build/sprites' // Keep the intermediate files
                },
                mode	: {
                    view	: {	 // Activate the «view» mode
                        bust : false,
                        render : {
                            scss	: true // Activate Sass output (with default options)
                        }
                    },
                    symbol : true		// Activate the «symbol» mode
                }}
        ))
        .pipe(gulp.dest('build/sprites'));
});

gulp.task('watch', function () {
    browserSync.init(
        {server: "./build"});
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.css, ['mincss']);
});

gulp.task('watcher', function () {
    gulp.watch(paths.css, ['mincss']);
    gulp.watch(paths.script, ['scripts']);
    gulp.watch(paths.html, ['html']);
});

gulp.task('del', function() {
    return del('build');
});
gulp.task('sync', ['watcher', 'browserSync']);

gulp.task('build', ['html', 'mincss']);

gulp.task('default', ['build', 'watch']);

gulp.task('sprite', ['svg']);
