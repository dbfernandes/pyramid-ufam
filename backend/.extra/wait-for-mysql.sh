#!/bin/sh
# Wait until MySQL is ready before running the application
while ! nc -z pyramid_db 3306; do
  sleep 1
done
echo "MySQL is up - executing command"
exec "$@"
