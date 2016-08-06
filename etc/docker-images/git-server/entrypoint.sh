#!/bin/bash

if [ -z "$PASSWORD" ]; then
  PASSWORD=`pwgen -cn -1 12`
  echo "warning: \$PASSWORD not specified, using "$PASSWORD
fi

mkdir /var/run/sshd
echo "root:$PASSWORD" | chpasswd
sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# make session optional
# SSH login fix. Otherwise user is kicked off after login
sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
echo "export VISIBLE=now" >> /etc/profile

if [ -z "$PROJECT_NAME" ]; then
  echo >&2 "error: \$PROJECT_NAME option is not specified"
  exit 1
fi

mkdir -p /git/$PROJECT_NAME.git
cd /git
git init --bare $PROJECT_NAME.git

exec "$@"
