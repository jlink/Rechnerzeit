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
    <script type="text/javascript" data-main="/js/bootstrap" src="${resource(dir: 'js', file: 'lib/require-jquery.js')}"></script>
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'rechnerzeit.css')}" type="text/css">
</head>
<body>

<header><h1>Lerne zu programmieren</h1></header>

<article id="playground">
    <nav id="session-nav" style="display: none;">
        <g:link uri="clear">Nochmal von vorne</g:link>
        <a id="send-program" href="mailto:?subject=Rechnerzeit: Mein Programm">Programm verschicken</a>
    </nav>
    <section class="output-box">
        <div id="editor"></div>
    </section>

    <section class="controls">
        <button id="single-execution" class="control"><g:img dir="images/silk-icons" file="control_play.png"/>Programm ausführen</button>
        <span class="control">
            <g:checkBox name="continuous-execution"/><label for="continuous-execution">Ständige Programmausführung</label>
        </span>
    </section>

    <section class="output-box">
        <textarea id="output" readonly="readonly"></textarea>
        <textarea id="exception-display" readonly="readonly"></textarea>
    </section>
</article>

<footer>
    <g:link uri="wasistdas">Was ist Rechnerzeit?</g:link>
    <g:link uri="impressum">Impressum</g:link>
    <g:link uri="credits">Credits</g:link>
</footer>

</body>
</html>