define(['rechnerzeit-playground', 'backbone', 'jquery', 'jquery.animate-colors-min'], function(playground, Backbone, $) {
        var rechnerzeit = { }

        var currentUserSession = null;
        var editor = null;
        var pendingChange = null;

        var UserSession = Backbone.Model.extend({
            urlRoot: '/session',
            defaults: {
                "program":  "// Ein kleines Programm\n" +
                    "var name = 'Jannek';\n" +
                    "var geboren = 2001;\n" +
                    "var alter = heute().jahr - geboren;\n" +
                    "drucke('Hallo, ' + name + '. ');\n" +
                    "druckeInZeile('Heute ist der ' + heute() + '. Es ist jetzt ' + jetzt());\n" +
                    "druckeInZeile('Du bist ' + alter + ' Jahre alt.');\n"
            }
        });

        function clearOutput(text) {
            $('#output').val('');
        }

        function lineOutput(text) {
            var old = $('#output').val();
            $('#output').val(old + text + '\n');
        }

        function evaluateCodeInEditor() {
            try {
                $('.output-box').removeClass("exception");
                clearOutput();
                $('#output').addClass("running");
                $('#output').css({'background-color': '#fff7ae'});
                var result = playground.eval(editor.getValue());
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

        function dumpObject(obj) {
            if (typeof(obj) === 'function') {
                return obj.toString()
            }

            return JSON.stringify(obj)
        }

        function onEditorChange() {
            clearTimeout(pendingChange);
            pendingChange = setTimeout(function() {
                evaluateCodeInEditor();
            }, 1000)
        }

        function gotoEnd() {
            editor.gotoLine(editor.session.getLength());
        }

        function initEditor() {
            editor = ace.edit("editor");
            editor.setTheme("ace/theme/eclipse");
            editor.getSession().setMode("ace/mode/javascript");
            editor.setShowPrintMargin(false);
            editor.getSession().on('change', onEditorChange);
            editor.commands.addCommand({
                name: 'ausfuehren',
                bindKey: {win: 'Ctrl-Y',  mac: 'Command-Y'},
                exec: function(editor) {
                    evaluateCodeInEditor();
                }
            });
        }

        function wireControls() {
            function onStopExecution() {
                $('#stop-execution').unbind('click', onStopExecution);
                $('#stop-execution').addClass("disabled");
                $('#continuous-execution').click(onContinuousExecution);
                $('#continuous-execution').removeClass("disabled");
                editor.getSession().removeListener('change', onEditorChange);
            }
            function onContinuousExecution() {
                $('#continuous-execution').unbind('click', onContinuousExecution);
                $('#continuous-execution').addClass("disabled");
                $('#stop-execution').click(onStopExecution);
                $('#stop-execution').removeClass("disabled");
                evaluateCodeInEditor();
                editor.getSession().on('change', onEditorChange);
            }
            function onSingleExecution() {
                evaluateCodeInEditor();
            }
            $('#single-execution').click(onSingleExecution);
            $('#stop-execution').click(onStopExecution);
        }

        function initSession(afterwards) {
            if (localStorage.getItem('sessionId')) {
                currentUserSession = new UserSession({id: localStorage.getItem('sessionId')});
                currentUserSession.fetch({
                        success: function(newSession) {
                            afterwards();
                        }, error: function(msg, err) {
                            alert("error: " + dumpObject(err));
                        }
                    }
                );
            } else {
                currentUserSession = new UserSession();
                afterwards();
            }
        }

        rechnerzeit.init = function() {
            wireControls();
            initEditor();
            initSession(function() {
                editor.setValue(currentUserSession.get('program'));
                gotoEnd();
                $('#editor textarea').focus();
            });
        };

        return rechnerzeit;
    }
);