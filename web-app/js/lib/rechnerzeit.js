define(['rechnerzeit.playground', 'rechnerzeit.is-mobile', 'backbone', 'jquery', 'jquery.animate-colors-min'], function(playground, isMobile, Backbone, $) {
        var rechnerzeit = { };
        var currentSession;
        var playgroundView;
        var router;

        function getStoredSessionId() {
            return localStorage.getItem('sessionId')
        }

        function setStoredSessionId(sessionId) {
            localStorage.setItem('sessionId', sessionId);
        }

        function clearStoredSessionId() {
            localStorage.removeItem('sessionId');
        }

        function logError(err) {
            console.log("ERROR: " + dumpObject(err));
        }

        function dumpObject(obj) {
            if (typeof(obj) === 'function') {
                return obj.toString()
            }

            return JSON.stringify(obj)
        }

        var Router = Backbone.Router.extend({

            initialize: function() {
                Backbone.history.start({pushState: true});
            },

            routes: {
                'clear'    : 'clearSession',
                'clear/'    : 'clearSession',
                '*sessionId'    : 'home',
                ''              : 'home'
            },

            home: function(sessionId) {
                if (sessionId) {
                    setStoredSessionId(sessionId);
                }
                if (getStoredSessionId()) {
                    this.navigate(getStoredSessionId(), {replace: true});
                }
            },

            clearSession: function() {
                clearStoredSessionId();
                hideSessionMenu();
                this.navigate('/', {replace: true});
            }
        });

        var UserSession = Backbone.Model.extend({
            urlRoot: '/session',
            defaults: {
                continuousExecution: true,
                lastChangeDate: new Date().toLocaleString(),
                program:  "// Ein kleines Programm\n" +
                    "var name = 'Jannek';\n" +
                    "var geboren = 2001;\n" +
                    "var alter = heute().jahr - geboren;\n" +
                    "drucke('Hallo, ' + name + '. ');\n" +
                    "druckeInZeile('Heute ist der ' + heute() + '. Es ist jetzt ' + jetzt());\n" +
                    "druckeInZeile('Du bist ' + alter + ' Jahre alt.');\n"
            },
            initialize: function() {
                _.bindAll(this, 'runProgram', 'toggleContinuousExecution');
                if (getStoredSessionId()) {
                    this.id = getStoredSessionId();
                }
            },
            toggleContinuousExecution: function() {
                this.set('continuousExecution', !this.get('continuousExecution'));
            },
            runProgram: function() {
                return playground.eval(this.get('program'), $('#output'));
            }
        });

        var PlaygroundView = Backbone.View.extend({
            el: $('#playground'),
            events: {
                'click #single-execution'       : 'evaluateProgram',
                'click #continuous-execution'   : 'toggleContinuousExecution'
            },
            initialize: function(){
                _.bindAll(this, 'initEditor', 'onEditorChange', 'gotoEditorEnd', 'onProgramChange', 'continuousSaveAndExecute', 'initUserSession',
                    'toggleContinuousExecution', 'initAceEditor', 'initPlainEditor', 'evaluateProgram');
                this.firstRun = true;
                this.initEditor();
                this.initUserSession();
            },
            initEditor: function() {
                if (isMobile.any())
                    this.initPlainEditor();
                else
                    this.initAceEditor();
            },
            initPlainEditor: function() {
                var editorArea = $("<textarea id='plainEditor'/>");
                var changeCallback = this.onEditorChange;
                $('#editor').append(editorArea);
                this.editor = {
                    gotoLine: function() {
//                        editorArea.scrollTop(
//                            editorArea[0].scrollHeight - editorArea.height()
//                        );
                    },
                    getValue: function() {return editorArea.val();},
                    setValue: function(text) {
                        editorArea.val(text);
                        changeCallback();
                    },
                    session: {getLength: function() {return 0;}}
                }
                editorArea.keyup(changeCallback);
            },
            initAceEditor: function() {
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

            initUserSession:function () {
                var doWithSession = _.bind(function(userSession) {
                    currentSession.on('change:program', this.onProgramChange);
                    this.editor.setValue(currentSession.get('program'));
                    $('#continuous-execution').attr('checked', currentSession.get('continuousExecution'));
                    this.gotoEditorEnd();
                    $('#editor textarea').focus();
                }, this);

                if (currentSession.id) {
                    showSessionMenu();
                    currentSession.fetch({
                            success: function(session) {
                                if (session.get("error")) {
                                    window.location.href = 'clear';
                                }
                                doWithSession(session);
                            }, error: function(msg, err) {
                                logError(err);
                            }
                        }
                    );
                } else {
                    hideSessionMenu();
                    doWithSession(this.currentSesssion);
                }
            },
            onEditorChange: function() {
                currentSession.set('program', this.editor.getValue());
            },
            gotoEditorEnd: function() {
                this.editor.gotoLine(this.editor.session.getLength());
            },
            onProgramChange: function() {
                clearTimeout(this.pendingChange);
                this.pendingChange = setTimeout(this.continuousSaveAndExecute, 1000)
            },
            toggleContinuousExecution: function() {
                currentSession.toggleContinuousExecution();
                if (currentSession.get('continuousExecution')) {
                    this.evaluateProgram();
                }
            },
            continuousSaveAndExecute: function() {
                if (this.firstRun) {
                    this.firstRun = false;
                    return;
                }
                currentSession.save({lastChangeDate: new Date()}, {
                    success: function(session){
                        if (session.id == getStoredSessionId())
                            return;
                        setStoredSessionId(session.id);
                        router.navigate(getStoredSessionId());
                        showSessionMenu();
                    },
                    error: function(msg, err){ alert(dumpObject(err))}
                });
                if (currentSession.get('continuousExecution')) {
                    this.evaluateProgram();
                }
            },
            evaluateProgram: function() {
                evaluateInPlayground(currentSession.runProgram);
            }

        });

        function showSessionMenu() {
            var mailto = $('#send-program').attr('href') + '&body=' + window.location.href
            $('#send-program').attr('href', mailto);
            $('#session-nav').show();
        }

        function hideSessionMenu() {
            $('#session-nav').hide();
        }

        function clearOutput(text) {
            $('#output').val('');
        }

        function lineOutput(text) {
            var old = $('#output').val();
            $('#output').val(old + text + '\n');
        }

        function evaluateInPlayground(code) {
            try {
                $('.output-box').removeClass("exception");
                clearOutput();
                $('#output').addClass("running");
                $('#output').css({'background-color': '#fff7ae'});
                var result = code();
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
            currentSession = new UserSession();
            playgroundView = new PlaygroundView();
        };

        return rechnerzeit;
    }
);