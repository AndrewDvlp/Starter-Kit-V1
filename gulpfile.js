var	gulp		= require('gulp'),
	browserSync	= require('browser-sync'),
	prefix		= require('gulp-autoprefixer'),
	cache		= require('gulp-cache'),
	concat		= require('gulp-concat'),
	imageop		= require('gulp-image-optimization'),
	jade		= require('gulp-jade'),
	jshint		= require('gulp-jshint'),
	jshStylish	= require('jshint-stylish'),
	minifycss	= require('gulp-minify-css'),
	plumber		= require('gulp-plumber'),
	rename		= require('gulp-rename'),
	sass		= require('gulp-sass'),
	uglify		= require('gulp-uglify');


// Serve the files from the build folder
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "build/"
		},
		notify: false
	});
});

// Reload browser
gulp.task('bs-reload', function() {
	return browserSync.reload();
});

// Optimize images   ==> Learn more about it. !!
gulp.task('images', function() {
	return gulp.src(['src/assets/images/**/*.png','src/assets/images/**/*.jpg','src/assets/images/**/*.gif','src/assets/images/**/*.jpeg'])
    .pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest('build/assets/images'));
});

// Process Jade files to HTML
gulp.task('jade', function() {
	return gulp.src('src/jade/*.jade')
	.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}
	}))
	.pipe(jade({
		'pretty': true
	}))
	.pipe(gulp.dest('build/'))
	.pipe(browserSync.reload({
		stream: true
	}));
});

// Process Sass (and Scss?) to CSS
gulp.task('styles', function() {
	return gulp.src('src/assets/css/**/*')
	.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}
	}))
	.pipe(sass({
		indentedSyntax: true
	}))
	.pipe(prefix({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(gulp.dest('build/assets/css/'))
	.pipe(browserSync.reload({ stream: true }));
});

// Process JavaScript files
gulp.task('js', function() {
	return gulp.src('src/assets/js/**/*.js')
	.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}
	}))
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish', {verbose: true}))
	.pipe(jshint.reporter('default'))
	.pipe(concat('main.js'))
	.pipe(gulp.dest('build/js/'))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(uglify())
	.pipe(gulp.dest('build/assets/js/'))
	.pipe(browserSync.reload({
		stream: true
	}));
});

// Build the project
gulp.task('build', ['styles', 'jade', 'js', 'images']);

// Watch files for changes
gulp.task('watch', function() {
	// Watch for styles changes and compile
	gulp.watch(['src/assets/css/**/*.sass', 'src/assets/css/**/*.scss'], ['styles']);
	// Watch for images and optimize them
	gulp.watch('src/assets/images/**/*', ['images']);
	// Watch for JavaScript changes and compile
	gulp.watch('src/assets/js/**/*.js', ['js']);
	// Watch for jade changes and compile
	gulp.watch('src/jade/**/*.jade', ['jade']);
	// Watch for HTML files and reload browser
	gulp.watch('**/*.html', ['bs-reload']);
})

// Compile, Serve and Watch
gulp.task('default', ['build', 'watch', 'bs-reload', 'browser-sync']);

// Serve and watch
gulp.task('serve', ['watch', 'bs-reload', 'browser-sync']);