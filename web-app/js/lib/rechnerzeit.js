define(['rechnerzeit-playground', 'backbone', 'jquery', 'jquery.animate-colors-min'], function(playground, Backbone, $) {
        var rechnerzeit = { };
        var playgroundView;
        var router;

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

        var UserSession = Backbone.Model.extend({
            urlRoot: '/session',
            defaults: {
                continuousExecution: true,
                "program":  "// Ein kleines Programm\n" +
                    "var name = 'Jannek';\n" +
                    "var geboren = 2001;\n" +
                    "var alter = heute().jahr - geboren;\n" +
                    "drucke('Hallo, ' + name + '. ');\n" +
                    "druckeInZeile('Heute ist der ' + heute() + '. Es ist jetzt ' + jetzt());\n" +
                    "druckeInZeile('Du bist ' + alter + ' Jahre alt.');\n"
            },
            toggleContinuousExecution: function() {
                this.set('continuousExecution', !this.get('continuousExecution'));
            }
        });

        var PlaygroundView = Backbone.View.extend({
            el: $('#playground'),
            events: {
                'click #single-execution'       : 'evaluateProgram',
                'click #continuous-execution'   : 'toggleContinuousExecution'
            },
            initialize: function(){
                _.bindAll(this, 'initEditor', 'onEditorChange', 'gotoEditorEnd', 'onProgramChange', 'evaluateProgram', 'initUserSession',
                    'toggleContinuousExecution', 'onContinuousExecutionChange');
                this.initEditor();
                this.initUserSession(_.bind(function() {
                    this.editor.setValue(this.currentSession.get('program'));
                    $('#continuous-execution').attr('checked', this.currentSession.get('continuousExecution'));
                    this.gotoEditorEnd();
                    $('#editor textarea').focus();
                }, this));
            },
            initEditor: function() {
                this.editor = ace.edit("editor");
                this.editor.setTheme("ace/theme/eclipse");
                this.editor.session.setMode("ace/mode/javascript");
                this.editor.setShowPrintMargin(false);
                this.editor.session.on('change', this.onEditorChange);
                this.editor.commands.addCommand({
                    name: 'ausfuehren',
                    bindKey: {win: 'Ctrl-Y',  mac: 'Command-Y'},
                    exec: this.evaluateProgram
                });
            },
            initUserSession:function (after) {
                this.currentSession = new UserSession();
                this.currentSession.on('change:program', this.onProgramChange);
                this.currentSession.on('change:continuousExecution', this.onContinuousExecutionChange);
                after();
            },
            onEditorChange: function() {
                this.currentSession.set('program', this.editor.getValue());
            },
            gotoEditorEnd: function() {
                this.editor.gotoLine(this.editor.session.getLength());
            },
            onProgramChange: function() {
                clearTimeout(this.pendingChange);
                this.pendingChange = setTimeout(this.evaluateProgram, 1000)
            },
            onContinuousExecutionChange: function() {
                if (this.currentSession.get('continuousExecution')) {
                    this.currentSession.on('change:program', this.onProgramChange);
                    this.evaluateProgram();
                } else {
                    this.currentSession.off('change:program', this.onProgramChange);
                }
            },
            toggleContinuousExecution: function() {
                this.currentSession.toggleContinuousExecution();
            },
            evaluateProgram: function() {
                evaluateCodeInPlayground(this.currentSession.get('program'));
            }

        });

        function dumpObject(obj) {
            if (typeof(obj) === 'function') {
                return obj.toString()
            }

            return JSON.stringify(obj)
        }

        function clearOutput(text) {
            $('#output').val('');
        }

        function lineOutput(text) {
            var old = $('#output').val();
            $('#output').val(old + text + '\n');
        }

        function evaluateCodeInPlayground(code) {
            try {
                $('.output-box').removeClass("exception");
                clearOutput();
                $('#output').addClass("running");
                $('#output').css({'background-color': '#fff7ae'});
                var result = playground.eval(code);
                if (result !== undefined)
                    lineOutput('\n>> ' + dumpObject(result))
            } catch (ex) {
                $('.output-box').addClass("exception");
                $('#exception-display').val(ex.message);
            } finally {
                setTimeout(function() {
                    $('#output').animate({'background-color': '#d3d3d3'}, {complete:
                        function() {
                            $('#output').removeClass("running");
                        }
                    });
                }, 500);
            }
        }

        rechnerzeit.start = function() {
            router = new Router();
            playgroundView = new PlaygroundView();
        };

        return rechnerzeit;
    }
);