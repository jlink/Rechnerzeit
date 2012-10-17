<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Rechnerzeit</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
    <script src="http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript" data-main="js/bootstrap" src="${resource(dir: 'js', file: 'lib/require.js')}"></script>
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'single.css')}" type="text/css">
</head>
<body>

<header><h1>Lerne zu Programmieren</h1></header>

<section class="output-box">
    <div id="editor"></div>
</section>

<section class="controls">
    <span id="single-execution" class="control disabled"><g:img dir="images/silk-icons" file="control_play.png"/>Programm einmal ausführen</span>
    <span id="continuous-execution" class="control disabled"><g:img dir="images/silk-icons" file="control_repeat.png"/>Programm ständig ausführen</span>
    <span id="stop-execution" class="control"><g:img dir="images/silk-icons" file="control_stop.png"/>Ständige Ausführung stoppen</span>
</section>

<section class="output-box">
    <textarea id="output" readonly="readonly"></textarea>
    <textarea id="exception-display" readonly="readonly"></textarea>
</section>

<footer>
    <g:link uri="wasistdas">Was ist Rechnerzeit?</g:link>
    <g:link uri="impressum">Impressum</g:link>
    <g:link uri="credits">Credits</g:link>
</footer>

</body>
</html>