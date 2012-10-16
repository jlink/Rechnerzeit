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

        return {
            init: function() {
                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/eclipse");
                editor.getSession().setMode("ace/mode/javascript");
                editor.setValue("drucke('Hallo!');");
                editor.setShowPrintMargin(false);
                editor.gotoLine(1);

                $('#editor textarea').focus();

                editor.getSession().on('change', function(e) {
                    try {
                        loescheAusgabe();
                        var result = eval(editor.getValue());
                        if (result)
                            druckeInZeile('\n>> ' + result)
                    } catch (ex) {
                        result = null;
                    }
                });
            }
        }
    }
);