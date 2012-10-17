define(['jquery'], function($) {
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

        function evaluateCodeInEditor(editor) {
            try {
                $('.output-box').removeClass("exception");
                loescheAusgabe();
                var result = eval(editor.getValue());
                if (result !== undefined)
                    druckeInZeile('\n>> ' + dumpObject(result))
            } catch (ex) {
                $('.output-box').addClass("exception");
                $('#exception-display').val(ex.message);
            }
        }

        function dumpObject(obj) {
            if (typeof(obj) === 'function') {
                return obj.toString()
            }

            return JSON.stringify(obj)
        }

        return {
            init: function() {
                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/eclipse");
                editor.getSession().setMode("ace/mode/javascript");
                editor.setShowPrintMargin(false);

                editor.getSession().on('change', function(e) {
                    evaluateCodeInEditor(editor);
                });

                editor.setValue("drucke('Hallo!');");
                editor.gotoLine(1);
                $('#editor textarea').focus();
            }
        }
    }
);