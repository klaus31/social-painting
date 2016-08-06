FROM ubuntu:15.04
MAINTAINER Daniel Oltmanns

# Setup basic environment
ENV DEBIAN_FRONTEND noninteractive

# install requirements
#  jq      -> reading json see http://xmodulo.com/2013/05/how-to-parse-json-string-via-command-line-on-linux.html / jq '.Body'
#  rsyslog -> for crontabs
#  ffmpeg  -> generating movies http://www.miscdebris.net/blog/2008/04/28/create-a-movie-file-from-single-image-files-png-jpegs/
RUN apt-get update && apt-get -y --force-yes install \
  jq \
  rsyslog \
  ffmpeg \
  bash-completion

ADD src /src
RUN chmod +x /src/start.sh
RUN rm /src/cron

ADD src/cron /etc/cron.d/cron
RUN chmod 0644 /etc/cron.d/cron
RUN touch /var/log/cron.log

#  evt besser CMD ["tail", "-f", "/var/log/cron.log"]
# CMD ["cron", "-f"]
CMD cron && tail -f /var/log/cron.log
