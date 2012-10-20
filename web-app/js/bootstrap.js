require.config({
    baseUrl: '/js/lib',
    shim: {
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require(['rechnerzeit', 'domReady'], function(Rechnerzeit, domReady){

    domReady(function() {
        Rechnerzeit.start();
    });

});