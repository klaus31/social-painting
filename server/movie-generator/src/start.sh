#!/bin/bash
#
# generiert in regelmaessigen abstaenden ein video aus den generierten bildern
# und legt es in /data/movies ab.
#
# hier erst einmal deaktiviert, weil mit der generierung der Bilder und diese als
# Datengrundlage erst einmal geschaut werden muss, wie weit man das hier voran treiben
# kann und in welcher Form. ggf. macht es auch sinn, einfach nur das "video of the day"
# lokal zu generieren und via ssh hochzuladen (oder, oder, oder)
#
# deshalb hier jetzt erst einmal
exit 0
PIC_FOLDER=`jq -r '.pic.folder' /environment/config.json`

echo `date`' hier bin ich. Pic-Data: '$PIC_FOLDER

cd $PIC_FOLDER

NUM=0
set *
for PIC; do
  cp -f $PIC "/tmp/img"`printf "%06d" $N`".png"
  N=`expr $N + 1`
done
cd /tmp
ffmpeg -f image2 -i img%06d.png /data/movies/`date +%Y%m%d%H%M%S`.mpg
