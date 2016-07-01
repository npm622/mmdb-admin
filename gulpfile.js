var _ = require( 'underscore' );

var bower = require( 'gulp-bower' );
var concat = require( 'gulp-concat' );
var debug = require( 'gulp-debug' );
var gulp = require( 'gulp' );
// var sourcemaps = require( 'gulp-sourcemaps' );
var templates = require( 'gulp-angular-templatecache' );

var templateCache = {
    path : 'src',
    filename : 'templates.js',
    options : {
        module : 'mmdb.admin.templates',
        standalone : true,
        moduleSystem : 'IIFE'
    }
};

var js = {
    src : [ 'src/app.js', 'src/services/**/*.js', 'src/components/**/*.js', templateCache.path + '/' + templateCache.filename ],
    lib : []
};

var html = {
    src : [ 'src/**/*.html' ]
};

var styles = {
    src : [ 'src/**/*.css' ],
    lib : []
};

var dest = {
    js : {
        path : 'dist',
        filename : 'bundle.js'
    },
    styles : {
        path : 'dist',
        filename : 'bundle.css'
    }
};

gulp.task( 'bower', function() {
    return bower().pipe( gulp.dest( 'bower_components' ) )
} );

gulp.task( 'templates', [ 'bower' ], function() {
    return gulp.src( html.src ).pipe( debug( {
        title : 'html:'
    } ) ).pipe( templates( templateCache.filename, templateCache.options ) ).pipe( gulp.dest( templateCache.path ) );
} );

gulp.task( 'js', [ 'templates' ], function() {
    gulp.src( _.flatten( [ js.lib, js.src ] ) ).pipe( debug( {
        title : 'javascript:'
    } ) )
    // .pipe( sourcemaps.init() )
    .pipe( concat( dest.js.filename ) )
    // .pipe( sourcemaps.write( dest.maps.path ) )
    .pipe( gulp.dest( dest.js.path ) );
} );

gulp.task( 'css', [ 'js' ], function() {
    gulp.src( _.flatten( [ styles.lib, styles.src ] ) ).pipe( debug( {
        title : 'styles:'
    } ) )
    // .pipe( sourcemaps.init() )
    .pipe( concat( dest.styles.filename ) )
    // .pipe( sourcemaps.write( dest.maps.path ) )
    .pipe( gulp.dest( dest.styles.path ) );
} );

gulp.task( 'default', [ 'css', 'js' ] );
