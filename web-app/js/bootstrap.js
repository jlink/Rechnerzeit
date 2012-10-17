var App = {};

require.config({
    baseUrl: '/js',
    paths: {
        jquery: 'lib/jquery-1.8.2',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
//        ace: 'lib/ace/ace',
        domReady: 'lib/domReady',
        rechnerzeit: 'rechnerzeit'
    },
    shim: {
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require([ 'jquery', 'backbone', 'router', 'rechnerzeit', 'domReady'], function($, Backbone, Router, Rechnerzeit, domReady){

    App.router = new Router();
    domReady(function() {
        Rechnerzeit.init();
    });

});