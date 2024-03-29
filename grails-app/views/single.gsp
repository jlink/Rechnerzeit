<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Rechnerzeit: Lerne zu programmieren</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
    <script src="http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript" data-main="/js/bootstrap" src="${resource(dir: 'js', file: 'lib/require-jquery.js')}"></script>
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'rechnerzeit.css')}" type="text/css">
</head>
<body>

<nav id="menu">
    <a id="show-course">Programmierkurs&nbsp;&gt;&gt;</a>
    <a id="hide-course" style="display: none;">&lt;&lt;&nbsp;Programmierkurs</a>
    <span id="session-nav" style="display: none">
        <a id="clear-program" href="clear">Neu Anfangen</a>
        %{--<a id="send-program" href="mailto:?subject=Rechnerzeit: Mein Programm">Programm verschicken</a>--}%
    </span>
    <span id="connect-icon"><g:img dir="images/silk-icons" file="database_refresh.png"/></span>
</nav>

<header><h1>Lerne zu programmieren</h1></header>

<div id="main">
    <article id="course" style="display: none;">
        <div>Auf der rechten Seite siehst du zwei Bereiche:</div>
        <ul>
            <li>Der <a class="highlight" highlight-id="#editor">obere Bereich</a> ist ein so genannter Editor, in den du deine Programme eingeben kannst.</li>
            <li>
                Im <a class="highlight" highlight-id="#output">unteren Bereich</a>  siehst du, was dein Programm bewirkt; das können Ausgaben sein, oder auch ein
                Rückgabewert, falls dein Programm am Ende ein Ergebnis zurückliefert,
            </li>
        </ul>
        <div>
            Wenn du auf <a class="highlight button" highlight-id="#execute-button">Programm&nbsp;ausführen</a> klickst, dann wird es Zeile für Zeile ausgeführt.
            Das geht jedoch so schnell, dass das Ergebnis der Ausführung sofort erscheint.
        </div>
        <div>
            Wenn du etwas im Programm veränderst, dann wird es sofort ausgeführt - es sein denn, du hast vorher
            den Haken bei <a class="highlight button" highlight-id="#execute-checkbox">Ständige&nbsp;Programmausführung</a> entfernt.
        </div>
    </article>
    <article id="playground">

        <section class="output-box">
            <div id="editor"></div>
        </section>

        <section class="controls">
            <span class="control" id="execute-button"><button id="single-execution"><g:img dir="images/silk-icons" file="control_play.png"/>Programm ausführen</button></span>
            <span id="execute-checkbox" class="control">
                <g:checkBox name="continuous-execution"/><label for="continuous-execution">Ständige Programmausführung</label>
            </span>
        </section>

        <section class="output-box">
            <textarea id="output" readonly="readonly"></textarea>
            <textarea id="exception-display" readonly="readonly"></textarea>
        </section>
    </article>
</div>

<footer>
    <g:link uri="wasistdas">Was ist Rechnerzeit?</g:link>
    <g:link uri="impressum">Impressum</g:link>
    <g:link uri="credits">Credits</g:link>
</footer>

</body>
</html>