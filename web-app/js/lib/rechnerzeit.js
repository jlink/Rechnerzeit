define(['rechnerzeit.playground', 'rechnerzeit.is-mobile', 'backbone', 'jquery', 'jquery.animate-colors-min', 'jquery.ba-resize.min'], function(playground, isMobile, Backbone, $) {
        var rechnerzeit = { };
        var currentSession;
        var codeRunner;
        var courseView;
        var menuView;
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

        function showSessionMenu() {
            var mailto = $('#send-program').attr('href') + '&body=' + window.location.href
            $('#send-program').attr('href', mailto);
            $('#session-nav').fadeIn();
        }

        function hideSessionMenu() {
            $('#session-nav').fadeOut();
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
                    return;
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

        var CodeRunner = Backbone.Model.extend({
            defaults: {
                output: '',
                result: undefined,
                exception: null,
                running:  false
            },
            initialize: function() {
                _.bindAll(this, 'run', 'print');
            },
            print: function(text) {
                var old = this.get('output');
                this.set('output', old + text);
            },
            run: function(code) {
                this.set('output', '');
                this.set('result', null);
                this.set('exception', null);
                this.set('running', true);
                try {
                    var result = code(this);
                    this.set('result', result);
                } catch (ex) {
                    this.set('exception', ex);
                } finally {
                    this.set('running', false);
                }
            }
        });

        var UserSession = Backbone.Model.extend({
            urlRoot: '/session',
            defaults: {
                continuousExecution: true,
                showingCourse: false,
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
                return playground.eval(this.get('program'), codeRunner);
            }
        });

        var MenuView = Backbone.View.extend({
            el: $('#menu'),
            events: {
                'click #show-course'        : 'clickShowCourse',
                'click #hide-course'        : 'clickHideCourse'
            },
            initialize: function(){
                _.bindAll(this, 'onShowingCourseChange', 'clickShowCourse', 'clickHideCourse', 'makeHideCourseVisible', 'makeShowCourseVisible');
                this.onShowingCourseChange();
                currentSession.on("change:showingCourse", this.onShowingCourseChange);
            },
            onShowingCourseChange: function() {
                if (currentSession.get('showingCourse')) {
                    this.makeHideCourseVisible();
                } else {
                    this.makeShowCourseVisible();
                }
            },
            makeHideCourseVisible:function () {
                this.$('#show-course').hide();
                this.$('#hide-course').show();
            },
            clickShowCourse: function() {
                currentSession.set('showingCourse', true);
                this.makeHideCourseVisible();
            },
            makeShowCourseVisible:function () {
                this.$('#show-course').show();
                this.$('#hide-course').hide();
            },
            clickHideCourse: function() {
                currentSession.set('showingCourse', false);
                this.makeShowCourseVisible();
            }
        })

        var CourseView = Backbone.View.extend({
            el: $('#course'),
            initialize: function(){
                _.bindAll(this, 'onShowingCourseChange', 'show', 'hide');
                this.onShowingCourseChange();
                currentSession.on('change:showingCourse', this.onShowingCourseChange);
            },
            onShowingCourseChange: function() {
                if (currentSession.get('showingCourse')) {
                    this.show();
                } else {
                    this.hide();
                }
            },
            show: function() {
                this.$el.show();
                this.$el.css('left: -300px');
                $('#playground').animate({'margin-left':'300px'}, {queue: false});
//                this.$el.animate({'left':'0px'}, {queue: false})
            },
            hide: function() {
                $('#playground').animate({'margin-left':'0px'});
                this.$el.hide();
            }
        })

        var PlaygroundView = Backbone.View.extend({
            el: $('#playground'),
            events: {
                'click #single-execution'       : 'evaluateProgram',
                'click #continuous-execution'   : 'toggleContinuousExecution'
            },
            initialize: function(){
                _.bindAll(this, 'initCodeRunner', 'onRunnerOutputChange', 'onRunnerResultChange', 'onRunnerExceptionChange', 'onRunnerRunningChange',
                    'initEditor', 'onEditorChange', 'gotoEditorEnd',
                    'onProgramChange', 'continuousExecute', 'initUserSession',
                    'toggleContinuousExecution', 'initAceEditor', 'initPlainEditor', 'evaluateProgram',
                    'shiftRight', 'shiftLeft');
                this.firstRun = true;
                this.initEditor();
                this.initCodeRunner();
                this.initUserSession();
            },
            initEditor: function() {
                if (isMobile.any())
                    this.initPlainEditor();
                else
                    this.initAceEditor();
            },
            initCodeRunner: function() {
                codeRunner.on('change:output', this.onRunnerOutputChange);
                codeRunner.on('change:result', this.onRunnerResultChange);
                codeRunner.on('change:exception', this.onRunnerExceptionChange);
                codeRunner.on('change:running', this.onRunnerRunningChange);
            },
            onRunnerExceptionChange: function() {
                var ex = codeRunner.get('exception');
                if (ex) {
                    $('#exception-display').val(ex.message);
                    $('.output-box').addClass("exception");
                } else {
                    $('#exception-display').val('');
                    $('.output-box').removeClass("exception");
                }
            },
            onRunnerRunningChange: function() {
                if (codeRunner.get('running')) {
                    $('#output').addClass("running");
                    $('#output').css({'background-color': '#fff7ae'});
                } else {
                    setTimeout(function() {
                        $('#output').animate({'background-color': '#d3d3d3'}, {complete:
                            function() {
                                $('#output').removeClass("running");
                            }
                        });
                    }, 500);
                }
            },
            onRunnerOutputChange: function() {
                $('#output').val(codeRunner.get('output'));
            },
            onRunnerResultChange: function() {
                var result = codeRunner.get('result');
                if (result === undefined)
                    return
                var old = $('#output').val();
                $('#output').val(old + '\n==> ' + dumpObject(result));
            },
            initPlainEditor: function() {
                var editorArea = $("<textarea id='plainEditor'/>");
                var changeCallback = this.onEditorChange;
                $('#editor').append(editorArea);
                this.editor = {
                    gotoLine: function() {},
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
                this.editor.commands.addCommand({
                    name: 'ausfuehren',
                    bindKey: {win: 'Ctrl-Y',  mac: 'Command-Y'},
                    exec: this.evaluateProgram
                });
                this.editor.setValue(currentSession.get('program'));
                this.editor.session.on('change', this.onEditorChange);
            },

            initUserSession:function () {
                currentSession.on('change:program', this.onProgramChange);
                $('#continuous-execution').attr('checked', currentSession.get('continuousExecution'));
                currentSession.on('change:continuousExecution', this.onContinuousExecutionChange);
                this.gotoEditorEnd();
                $('#editor textarea').focus();
            },
            onEditorChange: function() {
                currentSession.set('program', this.editor.getValue());
            },
            gotoEditorEnd: function() {
                this.editor.gotoLine(this.editor.session.getLength());
            },
            onProgramChange: function() {
                clearTimeout(this.pendingChange);
                this.pendingChange = setTimeout(this.continuousExecute, 1000)
            },
            onContinuousExecutionChange: function() {
                if (currentSession.get('continuousExecution')) {
                    this.evaluateProgram();
                }
            },
            toggleContinuousExecution: function() {
                currentSession.toggleContinuousExecution();
            },
            continuousExecute: function() {
                if (this.firstRun) {
                    this.firstRun = false;
                    return;
                }
                if (currentSession.get('continuousExecution')) {
                    this.evaluateProgram();
                }
            },
            evaluateProgram: function() {
                codeRunner.run(currentSession.runProgram);
            },
            shiftLeft: function() {
                this.$el.css('background-color: red');
            },
            shiftRight: function() {
                this.$el.css('background-color: blue');
            }

        });

        function initializeUserSession(afterwards) {
            currentSession = new UserSession();
            if (currentSession.id) {
                showSessionMenu();
                currentSession.fetch({
                        success: function(session) {
                            if (session.get("error")) {
                                window.location.href = 'clear';
                            }
                            afterwards();
                        }, error: function(msg, err) {
                            logError(err);
                        }
                    }
                );
            } else {
                hideSessionMenu();
                afterwards();
            }
        }

        function onSessionChange() {
            clearTimeout(this.pendingSave);
            this.pendingSave = setTimeout(continuousSessionSave, 5000);
        }

        function continuousSessionSave() {
            currentSession.save({lastChangeDate: new Date()}, {
                success: function(session){
                    if (session.id == getStoredSessionId())
                        return;
                    setStoredSessionId(session.id);
                    router.navigate(getStoredSessionId());
                    showSessionMenu();
                },
                error: function(msg, err){ logError(err)}
            });
        }

        rechnerzeit.start = function() {
            router = new Router();
            codeRunner = new CodeRunner();
            initializeUserSession(function() {
                currentSession.on('change:program change:continuousExecution change:showingCourse', onSessionChange);
                menuView = new MenuView();
                courseView = new CourseView();
                playgroundView = new PlaygroundView();
            });
        };

        return rechnerzeit;
    }
);