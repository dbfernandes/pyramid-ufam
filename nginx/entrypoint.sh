#!/bin/sh

# Substitute environment variables in the Nginx configuration template
envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Execute the CMD passed to the Docker container
exec "$@"