'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var pkg = require('../package.json');
var argv = require('yargs').argv;

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit (baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  var proxyOptions = {
    target: pkg.config.API_PROXY[(argv.proxy) ? argv.proxy : 'local'],
    changeOrigin: true,
    // logLevel: 'debug',
    // onProxyReq: function (proxyReq, req, res) {
    //    console.log(proxyReq);
    //  }
  };

  server.middleware = proxyMiddleware('/api', proxyOptions);

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.favicons, conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});