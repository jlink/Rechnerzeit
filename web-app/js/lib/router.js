define([ 'jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    var Router = Backbone.Router.extend({

        initialize: function() {
            Backbone.history.start({pushState: true});
        },

        routes: {
            ':sessionId'    : 'home',
            ''              : 'home'
        },

        home: function(sessionId) {
            if (sessionId === 'clear') {
                this.clearSession();
                return
            }
            if (sessionId) {
                localStorage.setItem('sessionId', sessionId);
            }
            if (localStorage.getItem('sessionId')) {
                this.navigate(localStorage.getItem('sessionId'), {replace: true});
            }
        },

        clearSession: function() {
            localStorage.removeItem('sessionId');
            this.navigate('/', {replace: true});
        }
    });

    return Router;
});


