define(['jquery'], function($) {
        var editor = null;
        var pendingChange = null;

        function loescheAusgabe(text) {
            $('#output').val('');
        }

        function drucke(text) {
            var old = $('#output').val();
            $('#output').val(old + text);
        }

        function druckeInZeile(text) {
            var old = $('#output').val();
            $('#output').val(old + text + '\n');
        }

        function evaluateCodeInEditor() {
            try {
                $('.output-box').removeClass("exception");
                loescheAusgabe();
                $('#output').addClass("running");
                var result = eval(editor.getValue());
                if (result !== undefined)
                    druckeInZeile('\n>> ' + dumpObject(result))
            } catch (ex) {
                $('.output-box').addClass("exception");
                $('#exception-display').val(ex.message);
            } finally {
//                $('#output').animate({'background-color': '#d3d3d3'});
                setTimeout(function() {
                    $('#output').removeClass("running");
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

        function initEditor() {
            function gotoEnd() {
                editor.gotoLine(editor.session.getLength());
            }
            function appendLine(line) {
                gotoEnd();
                editor.insert(line + "\n");
            }
            editor = ace.edit("editor");
            editor.setTheme("ace/theme/eclipse");
            editor.getSession().setMode("ace/mode/javascript");
            editor.setShowPrintMargin(false);
//            editor.setValue('');
//            appendLine("// Ein kleines Programm:");
//            appendLine("drucke('Hallo!');");
            gotoEnd();
            evaluateCodeInEditor();
            editor.getSession().on('change', onEditorChange);
            editor.commands.addCommand({
                name: 'ausfuehren',
                bindKey: {win: 'Ctrl-Y',  mac: 'Command-Y'},
                exec: function(editor) {
                    evaluateCodeInEditor();
                }
            });
            gotoEnd();
            $('#editor textarea').focus();
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

        return {
            init: function() {
                initEditor();
                wireControls();
            }
        }
    }
);