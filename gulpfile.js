var gulp = require('gulp')
var sass = require('gulp-sass')
var watch = require('gulp-watch')
var cssmin = require('gulp-minify-css')
var concat = require('gulp-concat')
var server = require('gulp-server-livereload')
var pug = require('gulp-pug')
var uglify = require('gulp-uglify')
var argv = require('yargs').demand(['ver', 'url', 'date']).argv

var paths = {
        styles: {
                sass: {
                        src: 'assets/stylesheets/**/*.sass'
                },
		vendor: {
			src: 'assets/vendor/*.css'
		},
        },
	js: {
		libs: ['node_modules/vue/dist/vue.min.js'],
		src: ['components/*.js']
	},
	templates: {
		pug: {
			src: ['views/**/*.pug'],
			pages: 'views/*.pug'
		}
	},
	fonts: 'assets/fonts/*.ttf',
	images: 'assets/img/*',
	build: 'build/'
}

gulp.task('sass', function() {
        gulp.src([paths.styles.sass.src, paths.styles.vendor.src])
          .pipe(sass())
          .pipe(cssmin())
	  .pipe(concat('main.min.css'))
	  .pipe(gulp.dest(paths.build))
})

gulp.task('views', function() {
	gulp.src(paths.templates.pug.pages)
	  .pipe(pug({
		  locals: {
			release: {
				version: argv.ver,
				url: argv.url,
				date: argv.date
			}
		  }
	  }))
	  .pipe(gulp.dest(paths.build))
})

gulp.task('js', function() {
	gulp.src(paths.js.src)
	  .pipe(uglify())
	  .pipe(concat('main.min.js'))
	  .pipe(gulp.dest(paths.build.concat('/scripts/')))
	gulp.src(paths.js.libs)
	  .pipe(gulp.dest(paths.build.concat('/scripts/')))
})

gulp.task('copy', function() {
	gulp.src(paths.images)
	  .pipe(gulp.dest(paths.build.concat('/img/')))
	gulp.src(paths.fonts)
	  .pipe(gulp.dest(paths.build.concat('/fonts/')))
})

gulp.task('watch', function() {
        gulp.watch(paths.styles.sass.src, function(event) {
                gulp.start('sass')
        })
	gulp.watch(paths.templates.pug.src, function(event) {
		gulp.start('views')
	})
	gulp.watch(paths.js.src, function(event) {
		gulp.start('js')
	})
	gulp.watch(paths.images, function(event) {
		gulp.start('copy')
	})
})

gulp.task('webserver', function() {
	gulp.src(paths.build)
		.pipe(server({
			livereload: true,
			open: true
	}))
})

gulp.task('default', ['copy', 'js', 'views', 'sass', 'webserver', 'watch'])
gulp.task('build', ['copy', 'js', 'views', 'sass'])
