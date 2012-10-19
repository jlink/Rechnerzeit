define([ 'jquery', 'underscore', 'backbone' ], function($, _, Backbone){

    var Router = Backbone.Router.extend({

        initialize: function() {
            Backbone.history.start({pushState: true});
        },

        routes: {
            ':catchall' : 'home',
            '' : 'home'
        },

        home: function(){
//            $("#content").html("Home")
        }
    });

    return Router;
});


