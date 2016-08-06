FROM ubuntu:14.04
MAINTAINER Daniel Oltmanns

# Setup environment
ENV DEBIAN_FRONTEND noninteractive

# Update sources
RUN apt-get update && apt-get -y install \
  nano \
  vim \
  curl \
  bash-completion \
  unzip \
  apt-transport-https \
  ca-certificates \
  less \
  openssh-server \
  pwgen \
  git

ENV NOTVISIBLE "in users profile"

COPY entrypoint.sh /entrypoint-git.sh
ENTRYPOINT ["/entrypoint-git.sh"]

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
