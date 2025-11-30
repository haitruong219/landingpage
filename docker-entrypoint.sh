#!/bin/sh
set -e

if [ "$(id -u)" = "0" ]; then
  if [ -n "$UID" ] && [ -n "$GID" ]; then
    chown -R "$UID:$GID" /app
    exec su-exec "$UID:$GID" "$@"
  fi
fi

exec "$@"

