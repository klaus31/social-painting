☑ 001 Generierung der Bilder nach Anzahl der Drawings
-----------------------------------------------------

Die Generierung der Bilder muss dann angestoßen werden, wenn die anzahl der Punkte erreicht ist. Nicht bei dem Aufruf von starterkit.json

Ansonsten kann es passieren, dass sehr viele Punkte über die Leitung beim Aufruf von Starterkit gehen müssen. Außerdem ist es sauberer - auch später für eine Filmgenerierung.

☑ 002 Schnelleres ws framework
------------------------------

Baue das schnellere websocket node.js framework ein "require('ws') the fastest websocket implementation"

☐ 003 Proxy Serverweit bauen
----------------------------

Entsprechend der grafik (auf Dropbox oder so) sollte der client erst auf einen proxy stoßen, der für alle anfragen zuständig ist. der delegiert dann anhand der hauptdomain an einen app proxy, der wiederum an den jeweiligen container delegiert.

☑ 004 Performance-Konzept
-------------------------

001 wurde nun zwar umgesetzt. Das Konzept überzeugt mich aber nicht.
Vorteil in der Tat ist jetzt, dass alle n Drawings ein png erstellt wird.
Bei z.B. 20 Drawings als Einstellung (entspricht 60 User gleichzeitig mit 500 drawings als einstellung), geht die Performance ziemlich zu Boden.

Warum? Keine Ahnung!!! Entweder liegt es an meiner Kiste - moment, ich gucke mal.
Ja, das ist so - meine Kiste geht zu grunde.

und docker stats hilft. Es ist der socialpainting_social-painting-dev-image-generator der zugrunde geht.
Was aber glaube ich heißt, dass es nur ein problem ist, weil server und client die gleiche machine sind?!


☐ 005 image-generator snapshot.json should get option "date"
-------------------------------------------------------------

Wenn die Filme erstellt werden, muss der Service auch die Möglichkeit bieten, ein Bild zu generieren unabhängig von dem aktuellem Zeitpunkt (also vom übergebenen datum und uhrzeit).


☐ 006 image-generator generate image based on image generated before
--------------------------------------------------------------------

Wenn es irgendwann mal eine Gigabyte große Datenbank gibt, wird es immer komplexer, die Bilder zu erstellen (muss immer komplett ausgelesen werden).
In diesem Fall macht es Sinn, wenn das Bild generiert wird auf dem Bild, was zuvor generiert wurde.

Diese Option muss konfigurierbar sein, um auf alles vorbeireitet zu sein


☐ 007 image-generator snapshot.json should get option "steps"
-------------------------------------------------------------

Dies ist das Killerfeature, das alle Bild in den übergebenen steps als drawing übergibst.
