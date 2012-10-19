define(['jquery'], function($) {

        function drucke(text) {
            var old = $('#output').val();
            $('#output').val(old + text);
        }

        function druckeInZeile(text) {
            var old = $('#output').val();
            $('#output').val(old + text + '\n');
        }

        function heute() {
            var date = new Date()
            return {
                jahr: date.getFullYear(),
                monat: date.getMonth() + 1,
                tag: date.getDate(),
                toString: function() {return this.tag + '.' + this.monat + '.' + this.jahr}
            }
        }

        function jetzt() {
            var date = new Date()
            return {
                stunde: date.getHours(),
                minute: date.getMinutes(),
                sekunde: date.getSeconds(),
                millisekunde: date.getMilliseconds(),
                toString: function() {return this.stunde + ':' + this.minute + ':' + this.sekunde + '.' + this.millisekunde}
            }
        }

        function evaluateCode(code) {
            return eval(code);
        }

        return (function() {
            function quatsch() {return 42}
            return {
                eval: evaluateCode
            }
        })();
    }
);