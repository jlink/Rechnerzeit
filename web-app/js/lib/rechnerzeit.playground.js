define(['jquery'], function ($) {

        var output

        function drucke(text) {
            var old = output.val();
            output.val(old + text);
        }

        function druckeInZeile(text) {
            text = text || '';
            drucke(text + '\n');
        }

        function heute() {
            var date = new Date()
            return {
                jahr:date.getFullYear(),
                monat:date.getMonth() + 1,
                tag:date.getDate(),
                toString:function () {
                    return twoDigits(this.tag) + '.' + twoDigits(this.monat) + '.' + this.jahr
                }
            }
        }

        function jetzt() {
            var date = new Date()
            return {
                stunde:date.getHours(),
                minute:date.getMinutes(),
                sekunde:date.getSeconds(),
                millisekunde:date.getMilliseconds(),
                toString:function () {
                    return twoDigits(this.stunde) + ':' + twoDigits(this.minute) + ':' + twoDigits(this.sekunde)
                }
            }
        }

        function twoDigits(number) {
            return ("0" + number).slice(-2)
        }

        function evaluateCode(code, outputTextArea) {
            output = outputTextArea;
            return eval(code);
        }

        return (function () {
            return {
                eval:evaluateCode
            }
        })();
    }
);