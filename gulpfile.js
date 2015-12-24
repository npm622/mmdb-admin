var gulp = require( 'gulp' );
var angularTemplateCache = require( 'gulp-angular-templatecache' );
var bower = require( 'gulp-bower' );
var clean = require( 'gulp-clean' );
var replaceTask = require( 'gulp-replace-task' );
var fs = require( 'fs' );
var pkg = require( './package.json' );

var config = {
	bowerDir : 'bower_components',
	directiveJs : pkg.name + '.js',
	directiveCss : pkg.name + '.css',
	htmltemplates : 'src/**/*.tmpl.html',
	templateCache : {
		tmpDir : 'tmp/',
		file : 'tmpls.tmp',
		options : {
			module : 'mmdb.admin',
			root : '',
			standAlone : false
		}
	}
};

gulp.task( 'bower', function() {
	return bower().pipe( gulp.dest( config.bowerDir ) )
} );

gulp.task( 'createTemplateCache', [ 'bower' ], function() {
	return gulp.src( config.htmltemplates ).pipe( angularTemplateCache( config.templateCache.file, config.templateCache.options ) ).pipe( gulp.dest( config.templateCache.tmpDir ) );
} );

gulp.task( 'injectTemplateCache', [ 'createTemplateCache' ], function() {
	gulp.src( 'src/' + config.directiveJs ).pipe( replaceTask( {
		patterns : [ {
			match : 'templateCache',
			replacement : fs.readFileSync( config.templateCache.tmpDir + config.templateCache.file, 'utf8' )
		} ]
	} ) ).pipe( gulp.dest( 'dist/js/' ) );
} );

gulp.task( 'clean', [ 'injectTemplateCache' ], function() {
	gulp.src( config.templateCache.tmpDir ).pipe( clean() );
} );

gulp.task( 'css', [ 'bower' ], function() {
	gulp.src( 'src/' + config.directiveCss ).pipe( gulp.dest( 'dist/css/' ) );
} );

gulp.task( 'default', [ 'bower', 'css', 'createTemplateCache', 'injectTemplateCache', 'clean' ] );
