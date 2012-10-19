define([ 'jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    var Router = Backbone.Router.extend({

        initialize: function() {
            Backbone.history.start({pushState: true});
        },

        routes: {
            ':sessionId' : 'home',
            '' : 'home'
        },

        home: function(sessionId) {
            if (sessionId) {
                App.sessionId = sessionId;
                this.navigate('', {replace: true})
            }
        }
    });

    return Router;
});


