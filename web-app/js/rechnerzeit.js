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

        return {
            init: function() {
                editor = ace.edit("editor");
                editor.setTheme("ace/theme/eclipse");
                editor.getSession().setMode("ace/mode/javascript");
                editor.setShowPrintMargin(false);
                editor.setValue("drucke('Hallo!');\n");
                evaluateCodeInEditor();
                editor.getSession().on('change', onEditorChange);
                editor.gotoLine(2);
                $('#editor textarea').focus();
            }
        }
    }
);