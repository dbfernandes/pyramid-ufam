FROM nginx:latest

# Copy the Nginx configuration template
COPY default.conf.template /etc/nginx/conf.d/default.conf.template

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Execute Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]