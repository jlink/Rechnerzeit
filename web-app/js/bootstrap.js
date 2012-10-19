var App = {};

require.config({
    baseUrl: '/js/lib',
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