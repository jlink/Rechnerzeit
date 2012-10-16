var App = {};

require.config({
    baseUrl: '/js',
    paths: {
        jquery: 'lib/jquery-1.8.2',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
//        ace: 'lib/ace/ace',
        rechnerzeit: 'rechnerzeit'
    },
    shim: {
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require([ 'jquery', 'backbone', 'router', 'rechnerzeit'], function($, Backbone, Router, Rechnerzeit){

    App.router = new Router();
    Rechnerzeit.init();
});