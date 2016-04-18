"use strict";
var gulp = require('gulp');
var ts = require('gulp-typescript');
var webpack = require('webpack-stream');

gulp.task('copyLibs', function () {
	return gulp.src('node_modules/jquery/dist/jquery.min.js')
		.pipe(gulp.dest('./js'));
});

gulp.task('compileTypeScript', function () {
	return gulp.src(['./src/game.ts'])
		.pipe(webpack({  
		  output: {
		    filename: "game.js"
		  },
		  resolve: {
		    extensions: ['','.ts']
		  },
		  module: {
		    loaders: [
		      { test: /\.(ts)$/, loader: 'ts-loader' }
		    ]
		  }})
		)
		.pipe(gulp.dest('./js'));
});

gulp.task("build", ["compileTypeScript", "copyLibs"]);